import Component from "../../src/index";

class Sample extends Component{
	constructor(id,options){
		super(id,options);
	}
	setupProp(){
		this.prop({
			"test" : 1,
			"test2" : 2
		});
		// 반환하는 키 값 list만 watch함.
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
});
sample.on("sample",(e) => {
	console.log("sample %o",this);
	console.log("activate!!!!!!!!!!!!!!!!");
});

// postfix로 !을 넣으면 이미 지나간 이벤트라도 fire됨.
sample.on("activate!",function(e){
	console.log(this);
	console.log("activate!!!!!!!!!!!!!!!!");
});

// 속성 변경
sample.prop("test",1000);

// 속성 변경 전
sample.on("beforeChangeProp",(e) => {
	console.log("beforeChangeProp %o",this);
	console.log("beforeChangeProp");
	console.log(e.newValue); // 새로운 값
	console.log(e.prevValue); // 기본 값
	// e.stop(); // stop하면 값 변경하지 않음
});

// 속성 변경 후
sample.on("changeProp",(e) => {
	console.log("changeProp %o",this);
	console.log("changeProp");
	console.log(e.newValue);
	console.log(e.prevValue);
});

sample.trigger("sample");
