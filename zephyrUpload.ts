import fs from "fs";
import axios from "axios";
require("dotenv").config();

// Mocked environment variables for demonstration
const ZEPHYR_BASE_URL = process.env.JIRA_BASE_URL;
const AUTH_TOKEN = process.env.API_TOKEN;
const ZEPHYR_HEADER_KEY = process.env.ZEPHYR_HEADER_KEY;
const ZEPHYR_HEADER_TOKEN = process.env.ZEPHYR_HEADER_TOKEN;

const statusMap: Record<string, number> = {
  passed: 1,
  failed: 2,
  skipped: 3,
};

type PlaywrightResult = {
  title: string;
  status: string;
  duration: number;
};

type ZephyrExecutionUpdate = {
  status: string;
  changeAssignee: boolean;
};

// Function to fetch execution ID from Zephyr
const getExecutionId = async (testKey: string): Promise<string> => {
  try {
    console.log(`Fetching issue ID for test key: ${testKey}`);
    const issueResponse = await axios.get(
      `${ZEPHYR_BASE_URL}/rest/api/2/issue/${testKey}`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }
    );
    const issueId = issueResponse.data.id;
    if (!issueId) {
      throw new Error(`Issue ID not found for test key: ${testKey}`);
    }

    console.log(`Fetching execution ID for test key: ${testKey}`);

    const response = await axios.get(
      `${ZEPHYR_BASE_URL}/rest/zapi/latest/execution?issueId=${issueId}`,
      {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      }
    );
    const executionId = response.data.exections[0].id;
    if (!executionId) {
      throw new Error(`Execution ID not found for test key: ${testKey}`);
    }

    return executionId;
  } catch (error) {
    // Narrow down the type of the error
    if (axios.isAxiosError(error)) {
      console.error(
        `Error fetching execution ID for test key: ${testKey}`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Unexpected error: ${String(error)}`);
    }
    throw error;
  }
};

const extractTests = (suites: any[]): PlaywrightResult[] => {
  const tests: PlaywrightResult[] = [];
  for (const suite of suites) {
    // Process `specs` within the suite
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          const result = test.result[0]; // Assume the first result is relevant
          tests.push({
            title: spec.title,
            status: result.status,
            duration: result.duration,
          });
        }
      }
    }
    // Recursively process nested suites
    if (suite.suites) {
      tests.push(...extractTests(suite.suites));
    }
  }
  return tests;
};

const updateZephyrExecution = async (
  executionId: string,
  updateData: ZephyrExecutionUpdate
): Promise<void> => {
  try {
    console.log(
      `Updating execution ID: ${executionId} with status: ${updateData.status}`
    );
    const response = await axios.put(
      `${ZEPHYR_BASE_URL}/rest/zephyr/latest/execution/${executionId}/execute`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH_TOKEN}`,
          [ZEPHYR_HEADER_KEY as string]: [ZEPHYR_HEADER_TOKEN as string],
        },
      }
    );
    console.log(
      `Execution ID ${executionId} updated successfully: `,
      response.data
    );
  } catch (error) {
    // Narrow down the type of error
    if (axios.isAxiosError(error)) {
      console.error(
        `Error updating exectuion ID: ${executionId}`,
        error.response?.data || error.message
      );
    } else {
      console.error(`Unexpected error: ${String(error)}`);
    }
    throw error;
  }
};

const processPlaywrightResults = async (
  resultFilePath: string
): Promise<void> => {
  try {
    console.log(`Reading results file from: ${resultFilePath}`);
    if (!fs.existsSync(resultFilePath)) {
      throw new Error(`Results file not found: ${resultFilePath}`);
    }

    const fileContent = fs.readFileSync(resultFilePath, "utf8");
    if (!fileContent) {
      throw new Error("Results file is empty.");
    }

    const resultsData = JSON.parse(fileContent);

    if (!resultsData.suites || !Array.isArray(resultsData.suites)) {
      throw new Error(
        'Invalid JSON format: "suites" not found or is not an array.'
      );
    }

    const allTests = extractTests(resultsData.suites);

    if (allTests.length === 0) {
      throw new Error("No tests found in the results file.");
    }

    console.log(`Found ${allTests.length} tests in the results.`);

    for (const test of allTests) {
      const testKey = test.title.split(":")[0].trim();
      const status = statusMap[test.status as PlaywrightResult["status"]];

      if (!status) {
        console.warn(
          `Status for test "${test.title}" is not mapped. Skipping.`
        );
        continue;
      }

      try {
        const executionId = await getExecutionId(testKey);
        const exectuionStatus = String(status);
        await updateZephyrExecution(executionId, {
          status: exectuionStatus,
          changeAssignee: false,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            `Failed to process test "${test.title}". API Error: ${error.message}`
          );
        } else {
          console.error(
            `Failed to process test "${test.title}". Unexpected error: ${String(
              error
            )}`
          );
        }
      }
    }

    console.log("All test results have been processed successfully.");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error processing Playwright test results (API): ",
        error.response?.data || error.message
      );
    } else {
      console.error(
        "Error processing Playwright test results: ",
        String(error)
      );
    }
  }
};
processPlaywrightResults("results.json");
