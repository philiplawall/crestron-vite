export const CrestronPiniaPlugin = (context) => {
  console.log(context);
  context.store.crestron = "Hello Crestron";
};

// function CrestronPiniaPlugin(context) {
//   context.store.crestron ="Hello Crestron"
//   return { crestron:  };
// }

// export { CrestronPiniaPlugin };
