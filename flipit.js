
// configuracoes centrais do app
const appConfig = {
	theme: "white",
	moldura: document.getElementById("moldura"),
	init(){
		header.criar();
		creationButton.criar();
		flashCards.init();
		handleGestures.verificarDeslizamento(this.moldura, handleGestures.onSwipe);
	},
};
//funcoes relacionadas ao header, optei em separar pois iria tornar mais facil a manuntencao.
const header = {
	header: null,
	title: null,
	themeButton: null,
	filterButton: null,
	criar(){
		if (this.header !== null) return;
		this.header = helperFunctions.createElement("div",appConfig.moldura, "headerDiv");
		this.title = helperFunctions.createElement("h1",this.header, "titulo");
		this.title.innerText = "Flip It!";
		this.themeButton = this.criarHeaderButton("fa-solid fa-circle-half-stroke", () => {
		const novoTema = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
		 document.documentElement.setAttribute("data-theme", novoTema);
		 appConfig.theme = novoTema;
	});

  	this.filterButton = this.criarHeaderButton( "fa-solid fa-sliders", () => {
		// filtra
	 });
	},
	criarHeaderButton(iconClass, onClick, extraClass = "") {
	const button = helperFunctions.createElement("button", this.header, "headerButton");

	if (extraClass) button.classList.add(extraClass);

	button.innerHTML = `<span><i class="${iconClass}"></i></span>`;
	button.addEventListener("click", onClick);

	return button;
}
};
const creationButton = {
	element: null,
	isVisible: true,
	criar(){
		if(this.element !== null) return;
		this.element = helperFunctions.createElement("button", appConfig.moldura, "creationButton");
		this.element.innerHTML = '<span><i class="fa-solid fa-pen"></i></span>';
		this.element.addEventListener("click", () => {
			if(editMenu.menu === null)editMenu.criar();
		});
	},
	atualizar(){
		this.isVisible ? this.hide() : this.show();
	},
	hide(){
		if(this.element === null) this.criar();
		this.element.classList.add("creationButton--hidden");
		this.isVisible = false;
	},
	show(){
		if(this.element === null) this.criar();
		this.element.classList.remove("creationButton--hidden");
		this.isVisible = true;
	},
};
//funcoes ultilitarias
const helperFunctions = {
	//cria um delay
delay(ms){
	return new Promise(resolve =>
	setTimeout(resolve, ms));
},
// versao resumida do document.createElement
createElement(tipo, local, classe){
	const nome = document.createElement(tipo);
	nome.classList.add(classe);
  local.appendChild(nome);
  return nome;
},
};
const flashCards = {
	flashCardsArray: [],
	flashCardDiv: null,
	init(){
		if(this.flashCardDiv) return;
		this.flashCardDiv = helperFunctions.createElement("div", appConfig.moldura,"flashCardDiv");
	},
	criar(){
		if(editMenu.menu === null) return;
		let dados = editMenu.salvarDadosEFecharInput();
   	dados = flashCards.salvarTextoEmArray(dados);
    	flashCards.renderizar(dados);
	},
	renderizar(dados){
		if(this.flashCardDiv === null) return;
		const pergunta = dados.pergunta;
		const resposta = dados.resposta;
		console.log(this.flashCardsArray);
		const flashCard = helperFunctions.createElement("div",this.flashCardDiv, "flashCard");
		this.ladoPergunta(flashCard, pergunta);
		flashCard.addEventListener("click",() => {
			this.trocarLado(flashCard, pergunta, resposta);
		});
	},
	gerarId(){
		if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
	},
	renderizarSalvas(){
		//fazer dps
	},
	salvarTextoEmArray(dados){
		const flashCard = {id:this.gerarId(), pergunta: dados.pergunta, resposta: dados.resposta};
		this.flashCardsArray.push(flashCard);
		return flashCard;
	},
	trocarLado(element, pergunta, resposta){
		if(element.dataset.side === "reply"){
			this.ladoPergunta(element, pergunta);
		} else {
			this.ladoResposta(element, resposta);
		}
	},
	ladoPergunta(element, pergunta){
		element.innerText = pergunta;
		element.classList.add("flashCard--question");
		element.classList.remove("flashCard--reply");
		element.dataset.side = "question";
	},
	ladoResposta(element, resposta){
		element.innerText = resposta;
		element.classList.add("flashCard--reply");
		element.classList.remove("flashCard--question");
		element.dataset.side = "reply";
	},
};
const editMenu = {
  menu: null,
  questionInput: null,
  replyInput: null,
  
  criar() {
  	if (this.menu !== null) return;
    this.menu = helperFunctions.createElement("div",appConfig.moldura,"editMenu");
    this.isVisible = true;

    this.questionInput = this.criarInput("Qual a pergunta?");
    this.replyInput = this.criarInput("Qual a resposta?");
  },
  criarInput(texto) {
    const wrapper = helperFunctions.createElement("div",this.menu, "inputWrapper");

    const input = helperFunctions.createElement("input", wrapper,"editInput");

    const label = helperFunctions.createElement("label",wrapper,"inputLabel");

    label.innerText = texto;

    // estado visual
    input.addEventListener("focus", () => {
      wrapper.classList.add("active");
    });

    input.addEventListener("blur", () => {
      if (!input.value) {
        wrapper.classList.remove("active");
      }
    });

    return input;
  },
  salvarDadosEFecharInput(){
  	const pergunta = this.questionInput.value;
  	const resposta = this.replyInput.value;
  	const dados = { pergunta: pergunta, resposta: resposta };
  	this.deletarMenu();
  	return dados;
  },
  deletarMenu(){
  	this.menu?.remove();
  	this.menu = null;
  },
};
//gestos
const handleGestures = {
	verificarDeslizamento(elemento, callback){
		const distancia = 100;
		let inicioX = 0;
		let inicioY = 0;
		elemento.addEventListener("touchstart", (e) => {
			inicioX = e.touches[0].clientX;
			inicioY = e.touches[0].clientY;
		});
		elemento.addEventListener("touchend", (e) => {
		const fimX = e.changedTouches[0].clientX;
		const fimY = e.changedTouches[0].clientY;
		const diffX = inicioX - fimX;
		const diffY = inicioY - fimY;
		if (Math.abs(diffX) > Math.abs(diffY)){
			if (Math.abs(diffX) > distancia) {
			const direcao = diffX > 0 ? "left" : "right";
			callback(direcao, Math.abs(diffX));
			}
		} else {
			if (Math.abs(diffY) > distancia) {
				const direcao = diffY > 0 ? "up" : "down";
			callback(direcao, Math.abs(diffY));
			}
		}
		});
	},
	onSwipe(direcao, diff){
		if (direcao === "up")	{
				flashCards.criar();
			}
	},
};
// inicia
appConfig.init();