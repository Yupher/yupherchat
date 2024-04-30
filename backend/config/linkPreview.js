const { getLinkPreview } = require("link-preview-js");
const { URL } = require("node:url");
const dns = require("node:dns");

const linkPreview = async (content) => {
  try {
    let preview = await getLinkPreview(content, {
      timeout: 1200,
      followRedirects: `manual`,
      handleRedirects: (baseURL, forwardedURL) => {
        const urlObj = new URL(baseURL);
        const forwardedURLObj = new URL(forwardedURL);
        if (
          forwardedURLObj.hostname === urlObj.hostname ||
          forwardedURLObj.hostname === "www." + urlObj.hostname ||
          "www." + forwardedURLObj.hostname === urlObj.hostname
        ) {
          return true;
        } else {
          return false;
        }
      },
      resolveDNSHost: async (url) => {
        return new Promise((resolve, reject) => {
          const hostname = new URL(url).hostname;
          //console.log(hostname);
          dns.lookup(hostname, { all: true }, (err, address, family) => {
            if (err) {
              console.log("error redirect", err);
              //reject(err);
              return;
            } else {
              console.log(address);
              resolve(address);
            }
          });
        });
      },
    });

    return preview;
  } catch (error) {
    console.log(error);
    return content;
  }
};

module.exports = linkPreview;
