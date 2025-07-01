import publicClient from "../api";

const client = publicClient();

const url = "/common/skills";
const Skills = {
  getSkills: async () => {
    try {
      const response = await client.get(`${url}`);

      return response.data;
    } catch (error: any) {
      console.error(
        "Axios error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },
};

export default Skills;
