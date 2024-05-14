import axios from "axios";

const url = "https://getin.pc.sc.gov.br/api_usuarios/graphql";

export async function validateToken(token, cpf) {
    if (!cpf || !token) return false;
    try {
      const result = await axios({
        method: "POST",
        url,
        data: {
          query: `
        {
          getTokenValidation(token: "${token}") {
            status
            msn
            cpf
          }
        }
        `,
        },
      });
  
      if (result.data?.errors) {
        console.log("erro: " + JSON.stringify(result.data.errors));
        return false;
      }
      if (
        result.data?.data?.getTokenValidation?.status === "Sucesso" &&
        result.data?.data?.getTokenValidation?.cpf === cpf
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }