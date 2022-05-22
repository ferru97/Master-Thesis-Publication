const Counter  = artifacts.require('Counter')

module.exports = async function(callback) {
  try {
    Counter.setProvider(web3.currentProvider)
    const counter = await Counter.at("0xA9F4fb74276bae186B8FBc24FB796E968B78ECF9")

    await counter.increment()

  }
  catch(error) {
    console.log(error)
  }

  callback()
}