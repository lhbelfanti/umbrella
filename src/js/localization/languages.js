import languagesConfig from "../configs/languages.json"

export default class Languages {
	constructor(persistence) {
		this._persistence = persistence;
		this._availableLanguages = languagesConfig["languages"];
		this._dropdownLanguages = this.getDropdownLanguagesList(this._availableLanguages);
		this._selectedLanguage =  this._availableLanguages[this._persistence.language];
		this._selectedLanguageCode = this._persistence.language;
		this._elements = {};
	}

	getDropdownLanguagesList(languages) {
		let list = [];
		for (let lang in languages) {
			list.push(languages[lang]);
		}

		return list;
	}

	languageTextToCode(text) {
		for (let lang in this._availableLanguages) {
			if (this._availableLanguages[lang] === text)
				return lang;
		}

		return "es";
	}

	subscribeElement(element, index) {
		this._elements[index] = element;
	}

	updateElements() {
		for (let e in this._elements) {
			this._elements[e].translate();
		}
	}

	get availableLanguages() {
		return this._availableLanguages;
	}

	get dropdownLanguages() {
		return this._dropdownLanguages;
	}

	set selectedLanguage(lang) {
		this._selectedLanguage = lang;
		this._selectedLanguageCode = this.languageTextToCode(this._selectedLanguage);
		this._persistence.language = this._selectedLanguageCode;
	}

	get selectedLanguage() {
		return this._selectedLanguage;
	}

	get selectedLanguageCode() {
		return this._selectedLanguageCode;
	}
}