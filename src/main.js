import "./css/index.css"
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");

const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")




//mudando as cores do card

function setCardType(type){
    const colors = {
        "visa":["#a36D99","#2d57f2"],
        "mastercard":["#df6f29","#C69347"],
        default:["black", "grey"],
    }
    
    ccBgColor01.setAttribute("fill", colors[type][0]);

    ccBgColor02.setAttribute("fill", colors[type][1]);

    ccLogo.setAttribute("src", `cc-${type}.svg`);
}

// setCardType("hipercard");

globalThis.setCardType = setCardType;


// CVC Código de Segurança -- Máscara
const securityCode = document.querySelector("#security-code");

const securityCodePattern ={
    mask:"0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern);


// Data de expiração
const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
    mask:"MM{/}YY",
    blocks:{
        YY:{
            mask:IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to:String(new Date().getFullYear()+10).slice(2),
        },
        MM:{
            mask:IMask.MaskedRange,
            from:1,
            to:12,
        }
    }
}

const expirationDateMasked = IMask(expirationDate,expirationDatePattern);


const cardNumber = document.querySelector("#card-number");

const cardNumberPattern = {
    mask:[
        {
            mask:"0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype:"visa",
          
        },
        {
            mask:"0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype:"mastercard"
        },
        {
            mask:"0000 0000 0000 0000",
            cardtype:"default"
        },

    ],
    dispatch:function(appended,dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g, "");
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex);
        });
        return foundMask;
    }
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);


const addButon = document.querySelector('button');
addButon.addEventListener('click', (e)=>{
    alert('Cartão adicioando');
});

document.querySelector("form").addEventListener('submit', (event)=>{
    event.preventDefault();
});


const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input', ()=>{
    const ccHolder = document.querySelector('.cc-holder .value');
    ccHolder.innerText = cardHolder.value.length === 0 ? "Fulano da Silva":  cardHolder.value;
});


securityCodeMasked.on("accept", ()=>{
    updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code){
    const ccSecurity = document.querySelector(".cc-security .value");
    ccSecurity.innerText = code.length === 0 ? "123" : code;
}


expirationDateMasked.on("accept", ()=>{
    updateExpirationDate(expirationDateMasked.value);
});

function updateExpirationDate(dateExpiration){
    const ccExpiration = document.querySelector(".cc-expiration .value");
    ccExpiration.innerText = dateExpiration.length === 0 ? "12/30" : dateExpiration;
}

cardNumberMasked.on("accept", ()=>{
    const cardType = cardNumberMasked.masked.currentMask.cardtype;
    setCardType(cardType);
    updateCardNumber(cardNumberMasked.value);

});

function updateCardNumber(number){
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}