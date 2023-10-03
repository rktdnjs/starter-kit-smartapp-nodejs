const SmartApp = require("@smartthings/smartapp");
const express = require('express');
const server = express();
const cors = require("cors");
const PORT = process.env.PORT || 3005;

server.use(express.json());
server.use(cors());

server.post('/', (req, res, next) => {
    smartapp.handleHttpCallback(req, res);
});

server.get('/api/image', (req, res) => {
    res.json(imageURLS);
})

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));

const imageURLS = [];

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
  // Contact Sensor 작동 - 카메라 스위치 On - 카메라 이미지 캡쳐 작동 이후 imageURL을 얻을 수 있음
  console.log("handleCameraImageCapture() is called...");
  console.log("이미지 URL : ", eventData.value);
  
  // 아래는 받아온 imageURL을 그대로 node.js단에서 처리하여 얻은 데이터들을 확인할 수 있는 코드
  if (eventData.value) {
    const imageURL = eventData.value;
    imageURLS.push(imageURL);
    console.log(imageURLS);
  }
}

async function handleCameraSwitch(context, eventData, eventTime) {
  console.log("handleCameraSwitch() is called...");
  // SmartThings 카메라가 어떤 행동에 의해 켜지면 imageCapture capability의 take command 사용
  // 이후에 ImageCapture가 완료되면 handleCameraImageCapture를 통해 이미지 캡쳐 유무 확인가능
  // 단, 이미지 캡쳐 결과를 확인하기 위해서는 일단 별도로 해당 URL에 토큰을 담아 GET요청을 해야만 함
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

/* Define the SmartApp */
const smartapp = new SmartApp()
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