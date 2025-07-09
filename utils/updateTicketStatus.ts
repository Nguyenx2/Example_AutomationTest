require("dotenv").config();
const axios = require("axios");

export class JiraStatus {
  static async updateTicketStatus(ticketId: string, statusId: string) {
    try {
      const response = await axios.post(
        `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketId}/transitions`,
        { transition: { id: statusId } },
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.USERNAME}:${process.env.API_TOKEN}`
            ).toString("base64")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`Ticket ${ticketId} updated successfully`, response.data);
    } catch (error: any) {
      console.error(
        `Error updating ticket ${ticketId}: `,
        error.response?.data || error.message
      );
    }
  }
}
