/**
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */

/**
 * A class used to manage events and options in a component
 * @ko 컴포넌트의 이벤트와 옵션을 관리할 수 있게 하는 클래스
 * @alias eg.Component
 */
class Component {
	/**
	 * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
	 */
	constructor(element, options = {activate: true}) {
		this._eventHandler = {};
		this.options = {};
		this.props = {};
		this.watchPropList = [];
		this.status = {};
		this.param = {
			element,
			options,
		};

		if (this.setupProp) {
			const oldSetupProp = this.setupProp;

			this.setupProp = (ele, opts) => {
				this.watchPropList = oldSetupProp.call(this, ele, opts);
			};
		}

		if (options.activate === undefined || options.activate) {
			this.activate();
			this.status["activate!"] = true;
		} else {
			this.status["activate!"] = options.activate;
		}
	}

	prop(...args) {
		if (args.length === 2) {
			const key = args[0];
			const value = args[1];
			const isWatchProp = this.watchPropList.indexOf(key) >= 0;

			if (isWatchProp) {
				if (this.trigger("beforeChangeProp", {
					prevValue: this.props[key],
					newValue: value,
				})) {
					this.props[key] = value;
					this.trigger("changeProp", {
						prevValue: this.props[key],
						newValue: value,
					});
				}
			} else {
				this.props[key] = value;
			}

			return this;
		}

		const key = args[0];

		if (typeof key === "string") {
			return this.props[key];
		}

		if (args.length === 0) {
			return this.props;
		}

		if (key.constructor === Object) {
			Object.keys(key).forEach(prop => {
				this.prop(prop, key[prop]);
			});
		}

		return this;
	}

	/**
	 * Triggers a custom event.
	 * @ko 커스텀 이벤트를 발생시킨다
	 * @param {String} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
	 * @param {Object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
	 * @return {Boolean} Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다.</ko>
	 * @example
class Some extends eg.Component {
  some(){
    this.trigger("hi");// fire hi event.
  }
}
	 */
	trigger(eventName, customEvent = {}, ...restParam) {
		let handlerList = this._eventHandler[eventName] || [];
		const hasHandlerList = handlerList.length > 0;

		if (eventName.indexOf("before") !== 0 && /!$/.test(eventName)) {
			this.status[eventName] = true;
		}

		if (!hasHandlerList) {
			return true;
		}

		// If detach method call in handler in first time then handeler list calls.
		handlerList = handlerList.concat();

		customEvent.eventType = eventName;

		let isCanceled = false;
		let arg = [customEvent];
		let i = 0;

		customEvent.stop = () => { isCanceled = true; };
		customEvent.currentTarget = this;


		if (restParam.length >= 1) {
			arg = arg.concat(restParam);
		}

		for (i = 0; handlerList[i]; i++) {
			handlerList[i].apply(this, arg);
		}

		return !isCanceled;
	}
	/**
	 * Executed event just one time.
	 * @ko 이벤트가 한번만 실행된다.
	 * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
	 * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
	 * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
	 * @example
class Some extends eg.Component {
  hi() {
    alert("hi");
  }
  thing() {
    this.once("hi", this.hi);
  }
}

var some = new Some();
some.thing();
some.trigger("hi");
// fire alert("hi");
some.trigger("hi");
// Nothing happens
	 */
	once(eventName, handlerToAttach) {
		if (typeof eventName === "object" &&
			typeof handlerToAttach === "undefined") {
			const eventHash = eventName;
			let i;

			for (i in eventHash) {
				this.once(i, eventHash[i]);
			}
			return this;
		} else if (typeof eventName === "string" &&
			typeof handlerToAttach === "function") {
			const self = this;

			this.on(eventName, function listener(...arg) {
				handlerToAttach.apply(self, arg);
				self.off(eventName, listener);
			});
		}

		return this;
	}

	/**
	 * Checks whether an event has been attached to a component.
	 * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
	 * @param {String} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
	 * @return {Boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
	 * @example
class Some extends eg.Component {
  some() {
    this.hasOn("hi");// check hi event.
  }
}
	 */
	hasOn(eventName) {
		return !!this._eventHandler[eventName];
	}

	/**
	 * Attaches an event to a component.
	 * @ko 컴포넌트에 이벤트를 등록한다.
	 * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
	 * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
	 * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
	 * @example
class Some extends eg.Component {
  hi() {
    console.log("hi");
  }
  some() {
    this.on("hi",this.hi); //attach event
  }
}
*/
	on(eventName, handlerToAttach) {
		if (typeof eventName === "object" &&
			typeof handlerToAttach === "undefined") {
			const eventHash = eventName;
			let name;

			for (name in eventHash) {
				this.on(name, eventHash[name]);
			}
			return this;
		} else if (typeof eventName === "string" &&
			typeof handlerToAttach === "function") {
			let handlerList = this._eventHandler[eventName];

			if (typeof handlerList === "undefined") {
				this._eventHandler[eventName] = [];
				handlerList = this._eventHandler[eventName];
			}

			handlerList.push(handlerToAttach);
			if (this.status[eventName]) {
				this.trigger(eventName);
			}
		}

		return this;
	}
	/**
	 * Detaches an event from the component.
	 * @ko 컴포넌트에 등록된 이벤트를 해제한다
	 * @param {eventName} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
	 * @param {Function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
	 * @return {eg.Component} An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
	 * @example
class Some extends eg.Component {
  hi() {
    console.log("hi");
  }
  some() {
    this.off("hi",this.hi); //detach event
  }
}
	 */
	off(eventName, handlerToDetach) {
		// All event detach.
		if (typeof eventName === "undefined") {
			this._eventHandler = {};
			return this;
		}

		// All handler of specific event detach.
		if (typeof handlerToDetach === "undefined") {
			if (typeof eventName === "string") {
				this._eventHandler[eventName] = undefined;
				return this;
			} else {
				const eventHash = eventName;
				let name;

				for (name in eventHash) {
					this.off(name, eventHash[name]);
				}
				return this;
			}
		}

		// The handler of specific event detach.
		let handlerList = this._eventHandler[eventName];

		if (handlerList) {
			let k;
			let handlerFunction;

			for (k = 0; (handlerFunction = handlerList[k]) !== undefined; k++) {
				if (handlerFunction === handlerToDetach) {
					handlerList = handlerList.splice(k, 1);
					break;
				}
			}
		}

		return this;
	}

	activate() {
		const {element} = this.param;
		const {options} = this.param;

		if (!this.status["activate!"] && this.trigger("beforeActivate")) {
			if (this.setupProp && this.trigger("beforeSetupProp")) {
				this.setupProp(element, options);
				this.trigger("setupProp");
			}
			if (this.setupDom && this.trigger("beforeSetupDom")) {
				this.setupDom(element, options);
				this.trigger("setupDom");
			}
			if (this.eventAttach && this.trigger("beforeEventAttach")) {
				this.eventAttach(element, options);
				this.trigger("eventAttach");
			}
			this.status["activate!"] = true;
			this.trigger("activate!");
		}
		return this;
	}
}

export default Component;
