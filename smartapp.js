const SmartApp = require("@smartthings/smartapp");

async function handleMotionSensor(ctx, eventData, eventTime) {
  console.log("handleMotionSensor() is called...");
}

async function handleButton(ctx, eventData, eventTime) {
  console.log("handleButton() is called...");
}

async function handleCamera(ctx, eventData, eventTime) {
  console.log("handleCamera() is called...");
}

async function handleCameraSwitch(ctx, eventData, eventTime) {
  console.log("handleCameraSwitch() is called...");
  if (eventData.value === "on") {
    ctx.api.devices.sendCommands(
      ctx.config.camera,
      "take",
      "correlationId...",
      "reason..."
    );
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
        .permissions("rx")
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
      "cameraHandler"
    );
    await context.api.subscriptions.subscribeToDevices(
      context.config.camera,
      "switch",
      "switch",
      "cameraSwitchHandler"
    );
  })
  .subscribedEventHandler("contactSensorHandler", (context, event) => {
    console.log("handleContactSensor() is called.");
    const value = event.value === "open" ? "on" : "off";
    context.api.devices.sendCommands(context.config.camera, "switch", value);
  })
  .subscribedEventHandler("motionSensorHandler", handleMotionSensor)
  .subscribedEventHandler("buttonHandler", handleButton)
  .subscribedEventHandler("cameraHandler", handleCamera)
  .subscribedEventHandler("cameraSwitchHandler", handleCameraSwitch);
