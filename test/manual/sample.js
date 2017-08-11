import Component from "../../src/index";

class Sample extends Component{
	constructor(id,options){
		// activate는 default가 true
		// 없으면 호출하지 않음
		super(id,options);
	}
	setupProp(){
		return ["test"];
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

// sample.on("beforeSetupProp",(e) => {
// 	console.log("beforeSetupProp");
// });
// sample.on("setupProp",(e) => {
// 	console.log("setupProp");
// });
// sample.on("beforeSetupDom",(e) => {
// 	console.log("beforeSetupDom");
// });
// sample.on("setupDom",(e) => {
// 	console.log("setupDom");
// });
// sample.on("beforeEventAttach",(e) => {
// 	console.log("beforeEventAttach");
// });
// sample.on("eventAttach",(e) => {
// 	console.log("eventAttach");
// });
// sample.on("beforeActivate",(e) => {
// 	console.log("beforeActivate");
// });
// sample.on("activate",(e) => {
// 	console.log("activate");
// });

sample.on("beforeChangeProp",(e) => {
	console.log("beforeChangeProp");
	console.log(e.newValue);
	console.log(e.prevValue);
});
sample.on("changeProp",(e) => {
	console.log("changeProp");
	console.log(e.newValue);
	console.log(e.prevValue);
});
sample.props.test  = 1 ;

sample.activate();

window.sample = sample;
