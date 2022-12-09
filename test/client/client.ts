import { myRandomData } from "./RandomData";

on('onResourceStart', (resName: string) => {
  if (resName === GetCurrentResourceName()) {
    console.log('Sandbox Test Client Script!')
    console.log(myRandomData)
  }
})