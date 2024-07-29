class VIN {
    map = {
        'A': '1', 'B': '2', 'C': '3', 'D': '4',
        'E': '5', 'F': '6', 'G': '7', 'H': '8',
        'I': '0', 'J': '1', 'K': '2', 'L': '3',
        'M': '4', 'N': '5', 'O': '0', 'P': '7',
        'Q': '0', 'R': '9', 'S': '2', 'T': '3',
        'U': '4', 'V': '5', 'W': '6', 'X': '7',
        'Y': '8', 'Z': '9'
      };
	constructor(s) {
		s = this.normalizarInput(s);
        this.validarVIN(s)
        
		if(s.match("\\w{17}") && !s.match("_")){
			this.vin = this.compararNovenaPosicion(s);
		}
		else if(s.match("\\w{8}\\W\\w{8}")){ //NO TOMA EL GUION BAJO, resuelto en normalizar
			
			this.vin = this.calculoNovena(s);
		}
        else
            throw new Error("CÓDIGO INCORRECTO: Error no contemplado")
	}

	validarVIN(s) {
        if (s.match("O|I|Q")){
            throw new Error(`CÓDIGO INCORRECTO: No puede haber O/I/Q`);
        }
        else if (s.length != 17 /*&& s.length != 16*/)
            throw new Error(`CÓDIGO INCORRECTO: faltan/sobran posiciones (${s.length}/17)`);
        
	}
    /**
     * 
     * @param {string} s 
     * @returns {string}
     */
	normalizarLongitud(s){
		if(s.length == 16){
			s = s.substring(0, 8) + '#'
					+ s.substring(8);
		}
		return s;
	}
    /**
     * 
     * @param {string} s 
     * @returns {string}
     */
	normalizarInput(s) {
		s = s.toUpperCase();
		s = s.replace(/\s+/g, ""); //remueve espacios
		s = s.replaceAll("_", "#");
        //s = this.normalizarLongitud(s);
        console.log(s)
		return s;
	}
    /**
     * 
     * @param {string} s 
     * @returns {string}
     */
	compararNovenaPosicion(s) {
		let calculo = this.calculoNovena(s);
		if(s == calculo)
			return s;
		throw new Error("CÓDIGO MAL CALCULADO: un codigo correcto puede ser " + VIN.formatearVIN(calculo));
	}
    /**
     * 
     * @param {string} s 
     * @returns {string}
     */
    static formatearVIN(s){
        return s.substring(0,8) + "<u>" + s.charAt(8) + "</u>" + s.substring(9,17)
    }

	calculoNovena(s){
		let acum = 0;
		for(let i = 0;i< 7;i++) { //procesa de la 1 a la 7
			let aux = s.charAt(i);
			if(isNaN(aux)) {//si es una letra
				aux = this.map[aux];
			}
			acum += parseInt(aux) * (8-i);
		}

		if(isNaN(s.charAt(7)))
			acum += parseInt(this.map[s.charAt(7)]) * 10;
		else
			acum += parseInt(s.charAt(7)) * 10;

		for(let i = 9;i< 17;i++) { //procesa de la 1 a la 7
			let aux = s.charAt(i);
			if(isNaN(aux)) {//si es una letra
				aux = this.map[aux];
			}
			acum += parseInt(aux) * (-i+18);
		}

		let noveno = acum%11;
        console.log(noveno)
		let aux = (noveno!=10)?noveno.toString():'X';
		let out = s.substring(0, 8) + aux
				+ s.substring(9);

		return out;
	}
   
	getVIN() {
		return this.vin;
	}

}

document.addEventListener('DOMContentLoaded', function() {
    const miBoton = document.getElementById('btncalcular');
    const miInput = document.getElementById('inputVIN')
    const salida = document.getElementById('respuesta')
    const ayuda = document.getElementById('openHelp')
    const panelAyuda = document.getElementById('help')
    function calcular() {
        try{
            let vin = new VIN(miInput.value)
            salida.innerHTML = "✅✅✅ <br>"+ VIN.formatearVIN(vin.getVIN()) + " \nes un código valido"
            salida.style.color = "rgb(48, 201, 68)"
        }catch(error){
            salida.innerHTML = "❌❌❌<br>" +error.message
            salida.style.color = "rgb(163, 39, 39)"
        }

    }
    
    function mayusculear(){
        const valor = miInput.value;
        const inicioCursor = miInput.selectionStart;
        const finCursor = miInput.selectionEnd;

        miInput.value = valor.toUpperCase();
        miInput.setSelectionRange(inicioCursor, finCursor);
    }
    
    function toggleAyuda(){
        panelAyuda.showModal()
    }

    miInput.addEventListener('input', mayusculear);
    miBoton.addEventListener('click', calcular);
    ayuda.addEventListener('mouseenter', toggleAyuda)
  });