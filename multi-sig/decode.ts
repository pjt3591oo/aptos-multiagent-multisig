const payload = `0x0000000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e74087472616e73666572000220cdcd7ec21e9efc46702c102d8e536bf880b70b2c64f462611086bef9992c40370854c3000000000000`;

const splitParse = (payload: string) => {
  const originPayload = payload;
  const step = 2;

  const moduleAddressLength = parseInt(payload.slice(0, step), 16);
  const ascciCodes: number[] = [];

  payload = payload.slice(step);

  for(let i = 0; i < moduleAddressLength; i++) {
    ascciCodes.push(
      parseInt( // 16진수를 10진수로 변경(ASCII 코드)
        payload.slice(0, step), 16
      )
    )
    payload = payload.slice(step);
  }

  return {
    ascciCodes,
    text: String.fromCharCode(...ascciCodes),
    originPayload,
    afterPayload: payload, 
  }
}

const parse = (payload: string) => {
  const did_remove_prefix = payload.slice(2);

  const MODULE_ADDRESS_LENGTH = 66;
  const moduleAddress = `0x${did_remove_prefix.slice(0, MODULE_ADDRESS_LENGTH)}`
  payload = did_remove_prefix.slice(MODULE_ADDRESS_LENGTH)

  const moduleInfo = splitParse(payload);
  const functionInfo = splitParse(moduleInfo.afterPayload);
  
  return {
    moduleAddress,
    moduleInfo,
    functionInfo
  }
}


const parsedPayload = parse(payload);
console.log(`function => ${parsedPayload.moduleAddress}::${parsedPayload.moduleInfo.text}::${parsedPayload.functionInfo.text}`);
console.log('functionArguments => ', parsedPayload.functionInfo.afterPayload);