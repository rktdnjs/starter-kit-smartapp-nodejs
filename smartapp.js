const SmartApp = require("@smartthings/smartapp");
const fs = require("fs");
const path = require("path");

async function handleContactSensor(context, eventData, eventTime) {
  console.log("handleContactSensor() is called.");
  if (eventData.value === "open") {
    context.api.devices.sendCommands(context.config.camera, "switch", "on");
  } else {
    context.api.devices.sendCommands(context.config.camera, "switch", "off");
  }
}

async function handleMotionSensor(context, eventData, eventTime) {
  console.log("handleMotionSensor() is called.");
}

async function handleButton(context, eventData, eventTime) {
  console.log("handleButton() is called...");
}

async function handleCameraImageCapture(context, eventData, eventTime) {
  console.log("handleCameraImageCapture() is called...");

  const imageURL = eventData.value;
  const myToken = "c05de873-f168-47ac-87b2-e25f5af63e35";

  const dirPath = "./";

  const fileNmae = "image.jpg";

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + myToken);

  fetch(imageURL, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => {
      console.log(response);
      console.log(response[Object.getOwnPropertySymbols(response)[1]]);
    })
    .catch((err) => console.log(err));
}

async function handleCameraSwitch(context, eventData, eventTime) {
  console.log("handleCameraSwitch() is called...");
  if (eventData.value === "on") {
    context.api.devices.sendCommands(context.config.camera, [
      {
        capability: "image",
        command: "take",
        arguments: ["1", "2"],
      },
    ]);
  }
}

module.exports = new SmartApp()
  .configureI18n()
  .enableEventLogging(2) // logs all lifecycle event requests/responses as pretty-printed JSON. Omit in production
  .page("mainPage", (context, page, configData) => {
    page.section("Starter kit", (section) => {
      // https://www.samsung.com/sec/smartthings/HOMEKITA/HOMEKITA/

      // (1) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#contactSensor
      section
        .deviceSetting("contactSensor")
        .capabilities(["contactSensor"])
        .permissions("r")
        .required(false);

      // (2) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#motionSensor
      section
        .deviceSetting("motionSensor")
        .capabilities(["motionSensor"])
        .permissions("r")
        .required(false);

      // (3) https://developer.smartthings.com/docs/devices/capabilities/capabilities-reference#button
      section
        .deviceSetting("smartButton")
        .capabilities(["button"])
        .permissions("r")
        .required(false);

      section
        .deviceSetting("camera")
        .capabilities(["imageCapture", "switch"])
        .permissions("rwx")
        .required(false);
    });
  })
  .updated(async (context, updateData) => {
    await context.api.subscriptions.delete();
    await context.api.subscriptions.subscribeToDevices(
      context.config.contactSensor,
      "contactSensor",
      "contact",
      "contactSensorHandler"
    );
    await context.api.subscriptions.subscribeToDevices(
      context.config.motionSensor,
      "motionSensor",
      "motion",
      "motionSensorHandler"
    );
    await context.api.subscriptions.subscribeToDevices(
      context.config.smartButton,
      "button",
      "button",
      "buttonHandler"
    );
    await context.api.subscriptions.subscribeToDevices(
      context.config.camera,
      "imageCapture",
      "image",
      "cameraImageCaptureHandler"
    );
    await context.api.subscriptions.subscribeToDevices(
      context.config.camera,
      "switch",
      "switch",
      "cameraSwitchHandler"
    );
  })
  .subscribedEventHandler("contactSensorHandler", handleContactSensor)
  .subscribedEventHandler("motionSensorHandler", handleMotionSensor)
  .subscribedEventHandler("buttonHandler", handleButton)
  .subscribedEventHandler("cameraImageCaptureHandler", handleCameraImageCapture)
  .subscribedEventHandler("cameraSwitchHandler", handleCameraSwitch);
