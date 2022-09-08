// const { ethers } = require('ethers')

import { ethers } from './ethers-5.6.esm.min.js'
import { abi, contractAddress } from './constants.js'

const connectButton = document.getElementById('connectButton')
const fundButton = document.getElementById('fundButton')
const balanceButton = document.getElementById('balanceButton')
const withDrawButton = document.getElementById('withDrawButton')

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withDrawButton.onclick = withDrawBalance

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } catch (e) {
            console.error(e)
        }

        connectButton.innerHTML = 'Connected!'
    } else {
        connectButton.innerHTML = 'Please Install Meta Mask.'
    }
}

async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}
async function fund() {
    const ethAmount = document.getElementById('ethAmount').value
    console.log(`Funding with ${ethAmount}....`)
    if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTransactionMine(transactionResponse, provider)
            console.log('Done')
        } catch (error) {
            console.error(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function withDrawBalance() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('WithDrawing ......')
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const transactionResponse = await contract.withdraw()

            await listenForTransactionMine(transactionResponse, provider)
            console.log('Done')
        } catch (error) {
            console.log(error)
        }
    }
}
