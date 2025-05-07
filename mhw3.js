let index=0;    
let isOnMenu=false;
const array = [
    "Sconto per studenti disponibile ora con Unidays.",
    "Fino al 10% di sconto su dispositivi audio o wearables, 40% di sconto su accessori smartphone con l'acquisto di un Phone(2a)Plus.",
];

const auth0Domain = "secret";
const auth0ClientId = "secret";
let auth0Client = null;
let user=null;
const supabaseUrl = 'secret';
const supabaseKey = 'secret';


async function initAuth0() 
{
    try {
        auth0Client = await createAuth0Client({
            domain: auth0Domain,
            client_id: auth0ClientId,
            cacheLocation: 'localstorage'
        });

        
        if (isRedirectCallback()) {
            await handleAuthRedirect();
        }

        const isAuthenticated = await auth0Client.isAuthenticated();
        aggiornaUI(isAuthenticated); 
    } catch (error) {
        console.error("Errore Auth0:", error);
    }
}

function isRedirectCallback() {
    return window.location.search.includes("code=") && window.location.search.includes("state=");
}

async function handleAuthRedirect() {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/"); 
}

async function aggiornaUI(isAuth) {
    const info = document.querySelector("#MessaggioLogin");
    if (!info) {
        console.warn("Elemento #MessaggioLogin non trovato nel DOM");
        return;
    }

    if (isAuth) {
        try {
            user = await auth0Client.getUser();
            info.innerHTML = "<p>✅ Loggato come: <strong>" + user.name + "</strong></p>";
        } catch (error) {
            console.error("Errore recupero utente:", error);
            info.innerHTML = `<p>⚠️ Errore nel caricamento utente.</p>`;
        }
    } else {
        info.innerHTML = "<p>🔒 Non sei loggato.</p>";
    }
}


function Login() 
{
    if(user==null)
    {
        auth0Client.loginWithRedirect
        (
            {
                redirect_uri: window.location.origin + "/mhw3.html"
            }
        );
    }
    else
    {
        alert("Accesso già effettuato!");
    }
}

function Logout() 
{
    if(user!=null)
    {
        auth0Client.logout({
            returnTo: window.location.origin + "/mhw3.html"
        });
    }
    else
    {
        alert("Accesso non ancora effettuato!");
    }
}

function apriDati(id) 
{
    let spazio = document.querySelector('.Dati');
    spazio.style.display = "flex";  
    document.body.classList.add("no-scroll");  
    caricaArticolo(id);
}

function caricaArticolo(id) {
    const url = supabaseUrl + "/rest/v1/Articolo?id=eq." + id + "&select=*"; 
    fetch(url, {
        headers: {
            apikey: supabaseKey, 
            Authorization: 'Bearer ' + supabaseKey, 
            Accept: 'application/json'
        }
    })
    .then(onResponse)  
    .then(onJsonArticolo);  
}


function onJsonArticolo(json) {
    let nome = document.querySelector('#nome');
    let prezzo = document.querySelector('#prezzo');
    let descr = document.querySelector('#descrizione');
    
    if (json.length === 0) {
        descr.innerHTML = '<p>Articolo non trovato.</p>';
    } else {
        const articolo = json[0];  
        nome.textContent = articolo.nome; 
        prezzo.textContent = "€ " + articolo.prezzo.toFixed(2);  
        descr.textContent = articolo.descrizione;
    }
}


function chiudiDati()
{
    let spazio = document.querySelector('.Dati');
    spazio.style.display="none";
    document.body.classList.remove("no-scroll");
}

function initButtonLoginOut()
{
    document.querySelector("#LoginButton").addEventListener('click', () => Login());
    document.querySelector("#LogoutButton").addEventListener('click', () => Logout());
}

function gestMobile()
 {
    let menu = document.querySelector("#mobileMenu");
    let sezione = document.querySelector("#allSection");
    if (menu.style.display === "flex") 
    {
        menu.style.display = "none";     
        sezione.style.display = "block";   
    } 
    else 
    {
        menu.style.display = "flex";
        sezione.style.display = "none";
    }
};

function textchange(direzione)
{
    elem = document.querySelector("#messaggio");
    new_add = document.createElement('a');
    if(direzione==="prev")
    {
        if(index!=0)
        {
            index--;
        }
        else
        {
            index=1;
        }

    }
    else
    {
        if(index!=1)
        {
           index++;
        }
        else
        {
            index=0;
        }

    }
    elem.textContent = array[index];
    if(index===0)
    {
        new_add.textContent="Per saperne di più.";
        new_add.href="https://it.nothing.tech/pages/student-program";
    }
    else if (index===1)
    {
        new_add.textContent="Scopri di più.";
        new_add.href="https://it.nothing.tech/products/phone-2a-plus";
    }
    elem.appendChild(new_add);
}

function apriMenu(type)
{
    let menu = document.querySelector("#sotto");
    let sottomenu;
    if(type==="tel")
    {
        sottomenu = document.querySelector("#Telefono");
        document.querySelector("#Audio").style.display="none";
        document.querySelector("#CMF").style.display="none";
    }
    else if(type==="audio")
    {
        sottomenu = document.querySelector("#Audio");
        document.querySelector("#Telefono").style.display="none";
        document.querySelector("#CMF").style.display="none";
    }
    else if(type==="CMF")
    {
        sottomenu = document.querySelector("#CMF");
        document.querySelector("#Audio").style.display="none";
        document.querySelector("#Telefono").style.display="none";
    }
    menu.style.display="flex";
    sottomenu.style.display="flex";
    
}
function gestMenu(type)
{
    let menu = document.querySelector("#sotto");
    
    if(menu.style.display="flex" && isOnMenu==false)
    {
        menu.style.display="none";
        document.querySelector("#Telefono").style.display="none";
        document.querySelector("#Audio").style.display="none";
        document.querySelector("#CMF").style.display="none";
    }
}
function sottoMenuEnter()
{
    let menu = document.querySelector("#sotto");
    isOnMenu=true;
}
function sottoMenuExit()
{
    let menu = document.querySelector("#sotto");
    isOnMenu=false;
    menu.style.display="none";
    document.querySelector("#Telefono").style.display="none";
    document.querySelector("#Audio").style.display="none";
    document.querySelector("#CMF").style.display="none";
}

function chiudiCarrello()
{
    let spazio = document.querySelector('#spazioCarrello');
    spazio.classList.remove("aperto");
    setTimeout(() => spazio.style.display="none",100)
    document.body.classList.remove("no-scroll");
}
function apriCarrello()
{
    let spazio = document.querySelector('#spazioCarrello');
    spazio.style.display="flex";
    setTimeout(() => spazio.classList.add("aperto"),1)
    document.body.classList.add("no-scroll");
}
function mostraInformativa()
{
    document.querySelector("#informativa").style.display="flex";
}

function apriPrimiSottoMenu(type,extra)
{
    let menu = document.querySelectorAll(type);
    let chiudi = document.querySelectorAll(extra);
    for(let i=0;i<menu.length;i++)
    {
        if(menu[i].style.display=="flex")
        {
            for(let j=0;j<chiudi.length;j++)
                {
                    chiudi[j].style.display="none";
                } 
            menu[i].style.display="none";  
        }
        else
        {
            menu[i].style.display="flex";  
        }
    }
}

function gestTendine(type)
{
    let menu = document.querySelectorAll(type);
    for(let i=0;i<menu.length;i++)
        {
            if(menu[i].style.display=="flex")
            {
                menu[i].style.display="none";  
            }
            else
            {
                menu[i].style.display="flex";  
            }
        }
}

function onResponse(response)
         {
            return response.json();
        }

        function onJsonEmail(json)
        {
            const ris = document.querySelector("#esitoEmail");
            if (json.format && json.dns && !json.disposable)
            {
                ris.innerHTML = 'Email valida!';
                ris.style.color="green";
                ris.display='block';
                
            } 
            else 
            {
                ris.innerHTML = 'Email NON valida!';
                ris.style.color="red";
                ris.display='block';
            }
        }

function verificaEmail() 
{
    const email = document.querySelector('#bottoneEmail').value;
    const url = 'https://www.disify.com/api/email/' + email;
    fetch(url).then(onResponse).then(onJsonEmail);
}

function apriLogin()
{
    let spazio = document.querySelector('#MenuUtente');
    spazio.style.display="flex";
    document.body.classList.add("no-scroll");
}
function chiudiLogin()
{
    let spazio = document.querySelector('#MenuUtente');
    spazio.style.display="none";
    document.body.classList.remove("no-scroll");
}

function initButton()
{
    for (let i = 1; i <= 7; i++) 
    {
        document.querySelector("#dati[data-index='" + i + "']").addEventListener("click", () => apriDati(i));
    }
    
}

document.querySelector("#menuIcon").addEventListener("click", gestMobile);
document.querySelector("#prev").addEventListener("click", () => textchange("prev"));
document.querySelector("#next").addEventListener("click", () => textchange("next"));

/* GESITONE PER NAV "TELEFONO" */
document.querySelector("#tel").addEventListener("mouseenter",() => apriMenu("tel"));
document.querySelector("#soloLink").addEventListener("mouseleave", () => setTimeout(gestMenu,200));
document.querySelector("#sotto").addEventListener("mouseenter",sottoMenuEnter);
document.querySelector("#sotto").addEventListener("mouseleave",sottoMenuExit);

/* GESITONE PER NAV "AUDIO" */
document.querySelector("#aux").addEventListener("mouseenter",() => apriMenu("audio"));
document.querySelector("#soloLink").addEventListener("mouseleave", () => setTimeout(gestMenu,200));
document.querySelector("#sotto").addEventListener("mouseenter",sottoMenuEnter);
document.querySelector("#sotto").addEventListener("mouseleave",sottoMenuExit);

/* GESITONE PER NAV "CMF" */
document.querySelector("#CMFs").addEventListener("mouseenter",() => apriMenu("CMF"));
document.querySelector("#soloLink").addEventListener("mouseleave", () => setTimeout(gestMenu,200));
document.querySelector("#sotto").addEventListener("mouseenter",sottoMenuEnter);
document.querySelector("#sotto").addEventListener("mouseleave",sottoMenuExit);

document.querySelector("#chiudiCarrello").addEventListener("click",chiudiCarrello);
document.querySelector("#carrelloIMG").addEventListener("click",apriCarrello);

document.querySelector("#bottoneEmail").addEventListener("click",mostraInformativa);
document.querySelector("#bottoneEmailFreccia").addEventListener("click",verificaEmail);

document.querySelector('#mobileMenu [data-index="0"]').addEventListener("click",() => apriPrimiSottoMenu("#tendaTelefoni",".tenda"));
document.querySelector('#mobileMenu [data-index="1"]').addEventListener("click",() => apriPrimiSottoMenu("#tendaAuricolari",".tenda"));
document.querySelector('#mobileMenu [data-index="2"]').addEventListener("click",() => apriPrimiSottoMenu("#tendaCMF",".tenda"));

document.querySelector('#mobileMenu [data-index="00"]').addEventListener("click",() => gestTendine("#tendaTELEFONO"));
document.querySelector('#mobileMenu [data-index="000"]').addEventListener("click",() => gestTendine("#tendaACCESSORIO"));
document.querySelector('#mobileMenu [data-index="11"]').addEventListener("click",() => gestTendine("#tendaAURICOLARE"));

document.querySelector('#mobileMenu [data-index="22"]').addEventListener("click",() => gestTendine("#tendaREPEATTEL"));
document.querySelector('#mobileMenu [data-index="222"]').addEventListener("click",() => gestTendine("#tendaREPEATACC"));
document.querySelector('#mobileMenu [data-index="2222"]').addEventListener("click",() => gestTendine("#tendaREPEATAUX"));
document.querySelector('#mobileMenu [data-index="22222"]').addEventListener("click",() => gestTendine("#tendaWATCH"));
document.querySelector('#mobileMenu [data-index="222222"]').addEventListener("click",() => gestTendine("#tendaALIMENTAZIONE"));
document.querySelector('#mobileMenu [data-index="2222222"]').addEventListener("click",() => gestTendine("#tendaESPLORA"));

document.querySelector("#Utente").addEventListener("click",apriLogin);
document.querySelector("#chiudiUtente").addEventListener("click",chiudiLogin);


document.querySelector("#LoginButton").addEventListener('click',Login);
document.querySelector("#LogoutButton").addEventListener('click',Logout);
document.addEventListener("DOMContentLoaded",initButtonLoginOut);
document.addEventListener("DOMContentLoaded",initAuth0);



document.addEventListener("DOMContentLoaded",initButton);

document.querySelector("#chiudi").addEventListener("click",chiudiDati);


