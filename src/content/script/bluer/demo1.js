import Demo2 from "./demo2.js";
import sampleImage from "~@/assets/sample.jpg";

export default function () {
  const image = document.createElement("img");
  image.src = chrome.runtime.getURL(sampleImage);
  image.className = "image"
  image.style.position = 'absolute';
  image.style.left = `300px`;
  image.style.top = `300px`;
  image.style.zIndex = '9999';
  console.log("demo1!!!!!");

  const aa = Demo2;
  aa.print();

  const box = document.createElement('div');
  box.className = "aa";
  box.style.position = 'absolute';
  box.style.backdropFilter = 'blur(10px)';
  box.style.left = `100px`;
  box.style.top = `100px`;
  box.style.zIndex = '9999';
  document.body.appendChild(box);
  document.body.appendChild(image);
}