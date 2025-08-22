const sharp = require("sharp");
sharp("public/Nectarua_test.png")
  .resize(1080, 1350, { fit: "cover", position: "center" })
  .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
  .toFile("public/Nectarua_test_1080x1350.jpg")
  .then(() => console.log("done"))
  .catch(console.error);
