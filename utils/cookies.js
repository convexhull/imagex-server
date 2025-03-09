const isProd = process.env.NODE_ENV === "production";

module.exports = function getCookiesOptions(maxAge) {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    domain: isProd ? ".yashpratapsingh.com" : undefined,
    maxAge,
  };
};
