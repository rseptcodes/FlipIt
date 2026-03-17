
// configuracoes centrais do app
const appConfig = {
	moldura: document.getElementById("moldura"),
	init(){
		themeManager.initTheme();
		header.create();
		creationButton.create();
		flashCards.init();
		tutorialManager.init();
		handleGestures.verificarDeslizamento(this.moldura, handleGestures.onSwipe);
	},
};
//funcoes relacionadas ao header, optei em separar pois iria tornar mais facil a manuntencao.
const header = {
	header: null,
	title: null,
	themeButton: null,
	filterButton: null,
	create(){
		if (this.header !== null) return;
		this.header = helperFunctions.createElement("div",appConfig.moldura, "headerDiv");
		this.title = helperFunctions.createElement("h1",this.header, "titulo");
		this.title.innerText = "Flip It!";
		this.themeButton = this.createHeaderButton("fa-solid fa-circle-half-stroke", () => {
			const newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
		themeManager.setTheme(newTheme);
	});

  	this.filterButton = this.createHeaderButton( "fa-solid fa-sliders", () => {
		flashCards.manageFilter();
	 });
	},
	createHeaderButton(iconClass, onClick, extraClass = "") {
	const button = helperFunctions.createElement("button", this.header, "headerButton");

	if (extraClass) button.classList.add(extraClass);

	button.innerHTML = `<span><i class="${iconClass}"></i></span>`;
	button.addEventListener("click", onClick);

	return button;
},
};
const themeManager = {
initTheme(){
	const loadTheme = localStorage.getItem("theme") || "white";
	this.setTheme(loadTheme);
},
	setTheme(newTheme){
	document.documentElement.setAttribute("data-theme", newTheme);
		 localStorage.setItem("theme", newTheme);
},
};
const creationButton = {
	element: null,
	isVisible: true,
	create(){
		if(this.element !== null) return;
		this.element = helperFunctions.createElement("button", appConfig.moldura, "creationButton");
		this.element.innerHTML = '<span><i class="fa-solid fa-pen"></i></span>';
		this.element.addEventListener("click", () => {
			if(editMenu.menu === null)editMenu.create();
		});
	},
	atualizar(){
		this.isVisible ? this.hide() : this.show();
	},
	hide(){
		if(this.element === null) this.create();
		this.element.classList.add("creationButton--hidden");
		this.isVisible = false;
	},
	show(){
		if(this.element === null) this.create();
		this.element.classList.remove("creationButton--hidden");
		void this.element.offsetWidth;
		helperFunctions.applyTempClass(this.element, "creationButton--fadeIn");
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
applyTempClass(element, className, callback){
	if(!element) return;
	const onEnd = () => {
		element.classList.remove(className);
		element.removeEventListener("animationend", onEnd);
		if(callback) callback();
	};
	element.addEventListener("animationend", onEnd);
	element.classList.add(className);
	void element.offsetWidth;
},
setOverlay(callback){
	if(document.querySelector(".overlay")) return;
	const overlay = this.createElement("div", appConfig.moldura, "overlay");
	overlay.addEventListener("click", (e) => {
		e.stopPropagation();
		callback?.();
		overlay.remove();
	});
},
removeOverlay(){
	document.querySelector(".overlay")?.remove();
},
enableInlineEditing(element, callback) {
    if (!element) return;

    element.contentEditable = true;
    
    element.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            element.blur();
        }
    }, { once: true });
},
// versao resumida do document.createElement
createElement(tipo, local, classe){
	const nome = document.createElement(tipo);
	nome.classList.add(classe);
  local.appendChild(nome);
  return nome;
},
createInfoText(texto){
	const infoDiv = this.createElement("div", appConfig.moldura, "infoText");
	infoDiv.innerText = texto;
	this.applyTempClass(infoDiv, "fadeIn", () => {
		this.applyTempClass(infoDiv, "fadeOut", () => {
			infoDiv?.remove();
		});
	});
},
detectClicks(element, onSingle, onDouble, delay = 200) {
    if (!element) return;
    let clickTimer = null;

    element.addEventListener("click", (e) => {
     if (clickTimer !== null) {
     clearTimeout(clickTimer);
     clickTimer = null;
     if (onDouble) onDouble(e);
        } else {
      clickTimer = setTimeout(() => {
      clickTimer = null;
      if (onSingle) onSingle(e);
            }, delay);
        }
    });
},
detectLongpress(element, className, callback) {
    let holdTimer;
    let isLongPress = false;

    element.addEventListener("touchstart", (e) => {
        isLongPress = false;
        
        holdTimer = setTimeout(() => {
            isLongPress = true;
            element.classList.add(className);
        }, 1000);
    });

    element.addEventListener("touchend", () => {
        clearTimeout(holdTimer);
        if(isLongPress) callback?.();
        element.classList.remove(className);
    }); 

    element.addEventListener("touchmove", () => {
        clearTimeout(holdTimer);
    });
},

returnRedacted(texto) {
	return texto.replace(/[a-zA-Z0-9]/g, "x");
},
};
const flashCards = {
	flashCardsArray: [],
	STATUS: {
  SUCCESS: "success",
  ERROR: "error",
  },
  currentFilter: "all",
	flashCardDiv: null,
	init(){
		if(this.flashCardDiv) return;
		this.flashCardDiv = helperFunctions.createElement("div", appConfig.moldura,"flashCardDiv");
		flashCards.renderLocalStorage();
	},
	create(){
		if(editMenu.menu === null) return;
		let data = editMenu.saveDataAndDeleteInput();
   	data = flashCards.saveData(data);
    	flashCards.render(data);
	},
	createFlashCardsUI(pergunta, resposta,id){
		const background = helperFunctions.createElement("div",this.flashCardDiv, "flashCard");
		const questionDiv = helperFunctions.createElement("div", background, "questionDiv");
		const replyDiv = helperFunctions.createElement("div",background, "replyDiv");
		
		questionDiv.innerText = pergunta;
		replyDiv.dataset.side = "reply";
		this.update(replyDiv, questionDiv, resposta);
		
		const buttons = flashCardButtons.init(background);
		flashCardButtons.hide(buttons.successButton, buttons.errorButton);
		const deleteButton = this.createDeleteButton(background, id);
		background.dataset.id = id;
		helperFunctions.detectClicks( background,() => this.update(replyDiv, questionDiv, resposta, buttons.successButton, buttons.errorButton), () => this.focusFlashcard(background));
		helperFunctions.detectLongpress( background,"flashCard--holding", () => this.enterEditMode(background));

		return {background, questionDiv, replyDiv};
	},
	render(data){
		if(this.flashCardDiv === null) return;
		const pergunta = data.pergunta;
		const resposta = data.resposta;
		const id = data.id;
		console.log(this.flashCardsArray);
		const {background, questionDiv, replyDiv} = this.createFlashCardsUI(pergunta, resposta, id);
		
		helperFunctions.applyTempClass(background, "fadeIn");
		if(data.status === "success") this.markCorrect(background);
    if(data.status === "error") this.markIncorrect(background);
	},
	gerarId(){
		if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
	},
	updateLocalStorage(array){
		localStorage.setItem("flashCardsArray", JSON.stringify(array));
	},
	renderLocalStorage(){
		try{
			const dadosSalvos = localStorage.getItem("flashCardsArray");
		  this.flashCardsArray = dadosSalvos ? JSON.parse(dadosSalvos) : [];
		} catch(erro){
      console.error("Erro ao carregar ao localStorage");
			helperFunctions.createInfoText("erro")
			this.flashCardsArray = [];
		}
		this.flashCardsArray.forEach((item, index) => {
			this.render(item, index);
		});
	},
	saveData(data){
		const flashCard = {id:this.gerarId(), pergunta: data.pergunta, resposta: data.resposta, status: null};
		this.flashCardsArray.push(flashCard);
		this.updateLocalStorage(this.flashCardsArray);
		return flashCard;
	},
	enterEditMode(background){
		const id = background.dataset.id;
		const data = this.flashCardsArray.find(c => c.id === id);
		
		background.classList.add("flashCard--editing");
		
		const questionDiv = background.querySelector(".questionDiv");
			
		const replyDiv = background.querySelector(".replyDiv");
		if(data) replyDiv.innerText = data.resposta;
    
		const triggerSave = () => this.saveEdit(id, questionDiv.innerText, replyDiv.innerText , background);
		
		helperFunctions.enableInlineEditing(questionDiv,(() => triggerSave));
		
		helperFunctions.enableInlineEditing(replyDiv, (() => triggerSave));
		helperFunctions.setOverlay(() => triggerSave());
		creationButton.hide();
	},
	saveEdit(id, novaPergunta, novaResposta, element){
		const card = this.flashCardsArray.find(c => c.id === id);
		if(card){
			card.pergunta = novaPergunta;
			card.resposta = novaResposta;
			this.updateLocalStorage(this.flashCardsArray);
		}
		const replyDiv = element.querySelector(".replyDiv");
		if(replyDiv.dataset.side === "question") replyDiv.innerText = helperFunctions.returnRedacted(novaResposta);
		helperFunctions.removeOverlay();
		creationButton.show();
		element.classList.remove("flashCard--editing");
		element.querySelector(".questionDiv").contentEditable = false;
		element.querySelector(".replyDiv").contentEditable = false;
	},
	createDeleteButton(background, id){
		const deleteButton = helperFunctions.createElement("button", background, "deleteButton");
			deleteButton.addEventListener("click",(e) => {
  	e.stopPropagation();
  	this.deleteFlashCard(background, id);
		});
		deleteButton.innerHTML = '<span class="fa-solid fa-trash-can"></span>';
    return deleteButton;
	},
	async deleteFlashCard(container, id){
		this.flashCardsArray = this.flashCardsArray.filter(n => n.id !== id);
		this.updateLocalStorage(this.flashCardsArray);
	  helperFunctions.applyTempClass(container, "flashCard--slideOut", container.remove.bind(container));
		
	},
	update(replyElement, questionElement, resposta, successElement, errorElement){
		if(replyElement.dataset.side === "reply"){
			this.hideReply(replyElement, resposta, successElement, errorElement);
			replyElement.classList.remove("replyDiv--focus");
			questionElement.classList.add("questionDiv--focus");
		} else {
			this.showReply(replyElement, resposta, successElement, errorElement);
			replyElement.classList.add("replyDiv--focus");
			questionElement.classList.remove("questionDiv--focus");
		}
	},
	markCorrect(container){
	const id = container.dataset.id;
	const card = this.flashCardsArray.find(c => c.id === id);
	if(!card) return;
	if(card.status === "error") return;
	card.status = "success";
	container.classList.add("flashCard--success");
	container.dataset.status = "success";
	this.updateLocalStorage(this.flashCardsArray);
},
	markIncorrect(container){
	const id = container.dataset.id;
	const card = this.flashCardsArray.find(c => c.id === id);
	if(!card) return;
	if(card.status === "correct") return;
	card.status = "error";
	container.classList.add("flashCard--error");
	container.dataset.status = "error";
	this.updateLocalStorage(this.flashCardsArray);
},
	hideReply(replyElement, resposta, successElement, errorElement){
		const redactedReply = helperFunctions.returnRedacted(resposta);
		replyElement.innerText = redactedReply;
		replyElement.dataset.side = "question";
		flashCardButtons.hide(successElement, errorElement);
	},
	showReply(replyElement,resposta, successElement, errorElement){
		replyElement.innerText = resposta;
		
		const container = replyElement.closest(".flashCard");
		if(!container.dataset.status) flashCardButtons.show(successElement, errorElement);
		
		replyElement.dataset.side = "reply";
	},
	async focusFlashcard(container){
		if(!container) return;
		if(container.classList.contains("flashCard--focus")){
			container.classList.remove("flashCard--focus")
			void container.offsetWidth;
			return;
		}
		  void container.offsetWidth;
			container.classList.add("flashCard--focus");
	},
		async applyFilter(filter){
		if (filter !== "all" && !Object.values(this.STATUS).includes(filter)) return;
		const cards = document.querySelectorAll(".flashCard");
    this.currentFilter = filter;
    cards.forEach(card => {

  if (card.dataset.status !== filter && filter !== "all") {
    card.classList.add("flashCard--slideOut");
    return;
  }

  const wasHidden = card.classList.contains("flashCard--slideOut");

  card.classList.remove("flashCard--slideOut");
  if (wasHidden) {
    helperFunctions.applyTempClass(card, "fadeIn");
  }
});
	},
	manageFilter(){
		const filters = ["all", this.STATUS.SUCCESS, this.STATUS.ERROR];
		const index = filters.indexOf(this.currentFilter);
		const nextIndex = ( index + 1 ) % filters.length;
		const nextFilter = filters[nextIndex]
		helperFunctions.createInfoText(nextFilter);
		this.applyFilter(nextFilter);
	},
};
const flashCardButtons = {
	init(container, id){
		const successButton = this.create(container);
		successButton.addEventListener("click",() => {
			flashCards.markCorrect(container);
		});
		
		const errorButton = this.create(container);
		errorButton.addEventListener("click",() => {
			flashCards.markIncorrect(container);
			
		});
		successButton.innerHTML = '<span class="fa-solid fa-check"></span>';
    errorButton.innerHTML = '<span class="fa-solid fa-xmark"></span>';
    
    const buttons = { successButton, errorButton };
    return buttons;
	},
	
	create(container){
		const button = helperFunctions.createElement("button",container, "flashCardButton");
		return button;
	},
	
	show(successElement, errorElement){
		successElement?.classList.remove("flashCardButton--hidden");
		errorElement?.classList.remove("flashCardButton--hidden");
	},
	hide(successElement, errorElement){
		successElement?.classList.add("flashCardButton--hidden");
		errorElement?.classList.add("flashCardButton--hidden");
	}
};
const editMenu = {
  menu: null,
  questionInput: null,
  replyInput: null,
  
  create() {
  	if (this.menu !== null) return;
    this.menu = helperFunctions.createElement("div",appConfig.moldura,"editMenu");
    this.isVisible = true;
    creationButton.hide();
    tutorialManager.swipeUpTip();
    helperFunctions.setOverlay(() => {
  if (this.menu) this.deletarMenu();
   });
    this.questionInput = this.createInput("Qual a pergunta?");
    this.replyInput = this.createInput("Qual a resposta?");
    const doneButton = helperFunctions.createElement("button", this.menu, "doneButton");
     doneButton.innerHTML = '<span><i class="fa-solid fa-check"></i></span>';
   
    doneButton.addEventListener("click",() => {
    	flashCards.create();
    });
  },
  createInput(texto) {
    const wrapper = helperFunctions.createElement("div",this.menu, "inputWrapper");

    const input = helperFunctions.createElement("input", wrapper,"editInput");
    input.placeholder = texto;
    
    // esta comentado porque eu estava testando em ambiente mobile
    
    //const label = helperFunctions.createElement("label",wrapper,"inputLabel");

    //label.innerText = texto;

    // estado visual
    //input.addEventListener("focus", () => {
      //wrapper.classList.add("active");
    //});

    //input.addEventListener("blur", () => {
      //if (!input.value) {
       // wrapper.classList.remove("active");
     // }
    //});

    return input;
  },
  saveDataAndDeleteInput(){
  	const pergunta = this.questionInput.value || "Por que o ceu tem pão?";
    const resposta = this.replyInput.value || "nao sei";
    
  	const data = { pergunta: pergunta, resposta: resposta };
  	this.deletarMenu();
  	
  	return data;
  },
  deletarMenu(){
  	helperFunctions.applyTempClass(this.menu, "fadeOut--menu", this.menu.remove.bind(this.menu));
   
  	this.menu = null;
  	helperFunctions.removeOverlay()
  	creationButton.show();
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
				flashCards.create();
			}
	},
};
//tutoriais
const tutorialManager = {
	tutorials: {
		flashCardsTutorial: "inProgress",
		swipeUpToCreate: "inProgress",
	},
	init(){
		this.getTutorialsStatus();
		this.flashCardsTutorial();
	},
	getTutorialsStatus(){
		try{
		  const salvo = localStorage.getItem("tutorialStatus");
		  if(salvo) this.tutorials = JSON.parse(salvo);
		}catch(erro){
			console.error("erro ao carregar o localStorage");
			helperFunctions.createInfoText("erro");
		}
	},
	setTutorialStatus(){
		localStorage.setItem("tutorialStatus", JSON.stringify(this.tutorials));
	},
	flashCardsTutorial(){
		if (this.tutorials.flashCardsTutorial === "completed") return;
		const data = {pergunta: "Clique uma vez para revelar a resposta, clique duas vezes para apagar.", resposta: "toque e segure para editar"}
		flashCards.render(data);
		this.tutorials.flashCardsTutorial = "completed";
		this.setTutorialStatus();
	},
	swipeUpTip(){
		if (this.tutorials.swipeUpToCreate === "completed") return;
		helperFunctions.createInfoText("Dica: arraste pra cima para criar o flashcard");
		this.tutorials.swipeUpToCreate = "completed";
		this.setTutorialStatus();
	},
};
// inicia
appConfig.init();
