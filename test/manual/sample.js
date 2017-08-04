import Component from "../../src/index";

class Sample extends Component{
	constructor(id,options){
		// activate는 default가 true
		// 없으면 호출하지 않음
		super(id,options);
	}
	setupProp(){
		console.log("====>setupProp");
	}
	setupDom(){
		console.log("====>setupDom");
	}
	eventAttach(){
		console.log("====>eventAttach");
	}
}

const sample = new Sample("#hi",{
	"activate" : false
});

sample.on("beforeSetupProp",(e) => {
	console.log("beforeSetupProp");
});
sample.on("setupProp",(e) => {
	console.log("setupProp");
});
sample.on("beforeSetupDom",(e) => {
	console.log("beforeSetupDom");
});
sample.on("setupDom",(e) => {
	console.log("setupDom");
});
sample.on("beforeEventAttach",(e) => {
	console.log("beforeEventAttach");
});
sample.on("eventAttach",(e) => {
	console.log("eventAttach");
});
sample.on("beforeActivate",(e) => {
	console.log("beforeActivate");
});
sample.on("activate",(e) => {
	console.log("activate");
});

sample.activate();
