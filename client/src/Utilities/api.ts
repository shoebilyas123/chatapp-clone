interface IConfigParams {
  token: string;
}

export const getAuthConfig = ({ token }: IConfigParams) => ({
  headers: {
    authorization: `Bearer ${token}`,
  },
});
