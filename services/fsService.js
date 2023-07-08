import fsModule from "fs";

const fsService = {
  async writeInFile(filePath, lineAtAppend, codeThatAppend) {
    return new Promise((resolve, reject) => {
      let code = new Array();
      let codeString = "";
      fsModule.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        }
        code.push(...data.split("\n"));
        code.splice(lineAtAppend, 0, codeThatAppend);
        codeString = code.join("\n");
        fsModule.writeFile(filePath, codeString, "utf-8", (err2) => {
          if (err2) {
            reject(err);
          }
          resolve({ status: "ok" });
        });
      });
    });
  },

  async deleteFromFile() {},
};

export default fsService;
