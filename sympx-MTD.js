function main() {
    event.preventDefault();
    checksCoef();
    
    // Naxodim Neravenstva-Basisi
    var NeRaven = [];
    for (let i=0; i<document.getElementById('lim').value; i++) {
        if (document.getElementById('sel'+i).value === "≤" || document.getElementById('sel'+i).value === "≥") {
            NeRaven.push(i);
        }       
    }
    const ExtraSlotsForTable = NeRaven.length;
    // SymplxTable
    var tableOfSymplx = [];
    for (let i=0; i<document.getElementById('lim').value; i++) {
        // massive "arr" to massive "tableOfSymplx"
        let arr = []; 
        for (let j=0; j<document.getElementById('vars').value; j++) {
            if (document.getElementById("inp"+((document.getElementById('vars').value*i)+j))) {
                if (document.getElementById('sel'+i).value === "≥") 
                    arr.push(document.getElementById("inp"+((document.getElementById('vars').value*i)+j)).value*(-1));
                else arr.push(document.getElementById("inp"+((document.getElementById('vars').value*i)+j)).value*1);
            }
        }
        // "arr" add extra "1" or "0"
        for (let j=0; j<NeRaven.length; j++) {
            if (NeRaven.includes(i) && NeRaven[j] === i) arr.push(1);
            else arr.push(0);
        }
        tableOfSymplx.push(arr);
    }
    console.log("start-tableOfSymplx:" + tableOfSymplx);
    NeRaven = [];   // clear arr from RowNumberWith "<">" for BASIS's
    // results in massive
    var arr_res = [];
    for (let i=0; i<document.getElementById('lim').value; i++) {
        if (document.getElementById('sel'+i).value === "≥") 
            arr_res.push(document.getElementById('res'+i).value*(-1));
        else arr_res.push(document.getElementById('res'+i).value*(1));
        
    }
    console.log("start-arr_res:" + arr_res);
    // find basis by <= or >=
    let NeRaven_counter = 0;
    for (let i=0; i<document.getElementById('lim').value; i++) {
        if (document.getElementById('sel'+i).value === "≤" || document.getElementById('sel'+i).value === "≥") {
            NeRaven.push((document.getElementById('vars').value*1)+NeRaven_counter);
            NeRaven_counter++;
        }
    }
    // find others basis's
    if (NeRaven.length < document.getElementById('lim').value) {
        // if "x\\0"
        for (let i=0; i<document.getElementById('lim').value; i++) {
            if (NeRaven.length === document.getElementById('lim').value) break;
            for (let j=0; j<((document.getElementById('vars').value*1)+ExtraSlotsForTable); j++) {
                // [i] - stroki // [j] - stolbiki
                if (NeRaven.length === document.getElementById('lim').value) break;
                if (tableOfSymplx[i][j] === "0" || tableOfSymplx[i][j] === 0) {
                    let counter = 0;    // count "0"
                    let indexVarNotAZero = 0;    // value, that don't zero
                    for (let m=0; m<document.getElementById('lim').value; m++) {
                        if (tableOfSymplx[m][j] === "0" || tableOfSymplx[m][j] === 0) counter++;
                        else indexVarNotAZero = m;
                    }
                    if (NeRaven.length < document.getElementById('lim').value) {
                        // x !== 0 and 0
                        if (counter === (document.getElementById('lim').value-1) && NeRaven.includes(j) === false) {
                            let ValueThatDontZero = tableOfSymplx[indexVarNotAZero][j];
                            NeRaven.push(j);
                            for (let m=0; m<document.getElementById('vars').value; m++) {
                                tableOfSymplx[indexVarNotAZero][m] /= ValueThatDontZero;
                            }
                        }
                    }          
                }
                if (NeRaven.length === document.getElementById('lim').value) break;
            }
            if (NeRaven.length === document.getElementById('lim').value) break;
        }
    }
    // last attempt: gaus mtd:
    if (NeRaven.length < document.getElementById('lim').value) {
        let RowThatHasBeenUsed = [];
        for (let i=0; i<document.getElementById('lim').value; i++) {
            for (let j=0; j<((document.getElementById('vars').value*1)+ExtraSlotsForTable); j++) {
                // [i] - stroki // [j] - stolbiki
                if (NeRaven.length < document.getElementById('lim').value) {
                    let counter = 0;    // count "x !== 0" in column
                    for (let m=0; m<document.getElementById('lim').value; m++) {
                        if (tableOfSymplx[m][j] !== "0" || tableOfSymplx[m][j] !== 0) counter++;
                    }
                    if (counter === (document.getElementById('lim').value*1) && NeRaven.includes(j) === false) {
                        // find the stroky that "=" (not a BASIS)
                        let SavedValueThatRow;
                        let RowNumberThatWeSeek = null;
                        NeRaven.push(j); // push: stolbik-X
                        console.log("tableOfSymplx-gaus1: " + tableOfSymplx);
                        console.log("NeRaven-gaus1: " + NeRaven);
                        for (let m=0; m<document.getElementById('lim').value; m++) {
                            if (document.getElementById('sel'+m).value === "=" && RowThatHasBeenUsed.includes(m) === false) { // Row Number That We Seek (with "=")
                                SavedValueThatRow = tableOfSymplx[m][j];
                                RowNumberThatWeSeek = m;
                                RowThatHasBeenUsed.push(m);
                                // delim ety stroky na "SavedValue"
                                for (let k=0; k<document.getElementById('vars').value; k++) {
                                    tableOfSymplx[m][k] /= SavedValueThatRow;
                                }
                                // delim v ende
                                arr_res[m] /= SavedValueThatRow;
                                break;
                            }
                        }
                        // vichitaem stroki
                        if (RowNumberThatWeSeek !== null) {
                            SavedValueThatRow = 0; 
                            for (let m=0; m<document.getElementById('lim').value; m++) {
                                SavedValueThatRow = tableOfSymplx[m][j];
                                if (m !== RowNumberThatWeSeek) {
                                    // vichitaem stroki table
                                    for (let k=0; k<document.getElementById('vars').value; k++) {
                                        tableOfSymplx[m][k] = tableOfSymplx[m][k] - tableOfSymplx[RowNumberThatWeSeek][k]*SavedValueThatRow;  
                                    }
                                    // vichitaem v ende
                                    arr_res[m] = arr_res[m]*1 - (arr_res[RowNumberThatWeSeek]*SavedValueThatRow*1)
                                }   
                            }
                        }
                        console.log("tableOfSymplx-gaus2: " + tableOfSymplx);
                        console.log("NeRaven-gaus2: " + NeRaven);
                    } 
                }
                if (NeRaven.length === document.getElementById('lim').value) break;    
            }
            if (NeRaven.length === document.getElementById('lim').value) break;
        }
    }
    // if BASIS not created = answer not found.
    console.log("beforeSort-NeRaven: " + NeRaven);
    if (NeRaven.length !== document.getElementById('lim').value*1) {
        NoAnswer("basis not created.");
        return 0;
    }
    else {
        // sorting NeRaven for table-BASIS
        let portable_arr = NeRaven;
        let cnt = (document.getElementById('vars').value*1);
        NeRaven = [];
        for (let i=0; i<document.getElementById('lim').value*1; i++) {
            NeRaven.push("x");
        }
        console.log("sort-NeRaven(with x's): " + NeRaven);
        // fill for start with "<=" or ">="
        for (let i=0; i<document.getElementById('lim').value*1; i++) {
            if (document.getElementById('sel'+i).value !== "=" && portable_arr.includes(cnt)) {
                NeRaven[i] = cnt;
                portable_arr[portable_arr.indexOf(cnt)] = "x";
                cnt++;
                console.log("sort2-NeRaven(> or <): " + NeRaven);
            }
        }
        // fill with "="
        for (let i=0; i<document.getElementById('lim').value*1; i++) {
            if (NeRaven[i] === "x") {
                for (let j=0; j<portable_arr.length*1; j++) {
                    if (portable_arr[j] !== "x") {
                        NeRaven[i] = portable_arr[j];
                        portable_arr[j] = "x";
                        console.log("sort3-NeRaven(=): " + NeRaven);
                        break;
                    }
                }    
            }
        }
    }
    // Free from "-" coef.
    for (let i=0; i<document.getElementById('lim').value*1; i++) {
        // check (-) in arr_res
        if (arr_res[i]*1 < 0) {
            let MaxAbsRes = arr_res[i]*1;
            let index_MaxAbsRes = i;
            let MaxRowValue = 1;
            let index_MaxAbsRowValue = null;
            let SavedValue = null;
            // check max value in "arr_res" on ABS.
            for (let j=0; j<document.getElementById('lim').value*1; j++) {
                if ((arr_res[j]*1 < MaxAbsRes) && (arr_res[j]*1 < 0)) {
                    MaxAbsRes = arr_res[j]*1;
                    index_MaxAbsRes = j;
                }
            }
            // check max value in that row on ABS.
            for (let j=0; j<((document.getElementById('vars').value*1)+ExtraSlotsForTable); j++) {
                if ((tableOfSymplx[index_MaxAbsRes][j]*1 < MaxRowValue || MaxRowValue === 1)
                && (tableOfSymplx[index_MaxAbsRes][j]*1 < 0)) {
                    MaxRowValue = tableOfSymplx[index_MaxAbsRes][j]*1;
                    index_MaxAbsRowValue = j;
                }           
            }
            // set new BASIS in arr "NeRaven"
            if (index_MaxAbsRowValue !== null) {
                NeRaven[index_MaxAbsRes*1] = index_MaxAbsRowValue;
                // calculation with rows: divide this row
                SavedValue = tableOfSymplx[index_MaxAbsRes*1][index_MaxAbsRowValue*1];
                for (let j=0; j<((document.getElementById('vars').value*1)+ExtraSlotsForTable); j++) {
                    tableOfSymplx[index_MaxAbsRes*1][j] /= SavedValue;                 
                }
                // divide this row (end)
                arr_res[index_MaxAbsRes] /= SavedValue;
                // calculation with rows: minus other rows
                for (let j=0; j<document.getElementById('lim').value*1; j++) {
                    if (j !== (index_MaxAbsRes*1)) {
                        SavedValue = tableOfSymplx[j][index_MaxAbsRowValue*1]; 
                        for (let IA=0; IA<((document.getElementById('vars').value*1)+ExtraSlotsForTable); IA++) {
                            tableOfSymplx[j][IA] = tableOfSymplx[j][IA] - (tableOfSymplx[index_MaxAbsRes][IA]*SavedValue);
                        }
                        // minus in end
                        arr_res[j] = arr_res[j]*1 - (arr_res[index_MaxAbsRes]*SavedValue);
                    }  
                }
            }
            else {
                NoAnswer("row with (-Y) value don't have (-y) values");
                return 0;
            }  
            i = 0; // ReTry.
        }
    }
    
    // fill arr_F with coef from "Celevaya-F".
    let arr_F = [];
    for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
        if (document.getElementById("inp_main"+i)) arr_F.push(document.getElementById("inp_main"+i).value*1);
        else arr_F.push(0);
    }
    console.log("tableOfSymplx: " + tableOfSymplx);
    console.log("NeRaven: " + NeRaven);
    console.log("arr_F:" + arr_F);

    // Calculations
    let F;
    let deltas = [];
    let Qi = [];
    let minDelta;
    let index_minDelta;
    let minQi;
    let index_minQi;
    let SavedValueA;
    let arr_AllValuesOf_F = [];
    let F_counter = 0;
    
    // Fill deltas with Empty
    for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
        deltas.push("x");
    }
    // Fill Qi with Empty
    for (let i=0; i<(document.getElementById('lim').value*1); i++) {
        Qi.push(0);
    }
    
    // Cycle Until...
    while (MaximizationMinimization(deltas, ExtraSlotsForTable)) {
        // calculate "F"
        F = 0;
        for (let i=0; i<document.getElementById('lim').value*1; i++) {
            F += (arr_res[i]*1)*arr_F[NeRaven[i]*1];
        }
        console.log("F =" + F);
        // Check to StopInfinityCycle
        arr_AllValuesOf_F.push(Math.round(F));
        for (let k=0; k<arr_AllValuesOf_F.length; k++) {
            if (arr_AllValuesOf_F[k] === Math.round(F)) F_counter++;
        }
        if (F_counter > 10) {
            NoAnswer("infinity cycle has been destroyed.");
            return 0;
        }
        F_counter = 0;
        // Calculate deltas;
        for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
            deltas[i] = 0;
            for (let j=0; j<document.getElementById('lim').value; j++) {
                deltas[i] += tableOfSymplx[j][i]*arr_F[NeRaven[j]*1]*1;
            }
            deltas[i] -= arr_F[i]
            console.log("deltas: " + deltas);
        }
        // if - is Success.
        if (MaximizationMinimization(deltas, ExtraSlotsForTable) === false) {
            Answer (F, ExtraSlotsForTable, NeRaven, arr_res);
            break; 
        }
        // Find the lowest delta
        minDelta = deltas[0]*1;
        index_minDelta = 0;
        for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
            if (minDelta > deltas[i]*1)  {
                minDelta = deltas[i]*1;
                index_minDelta = i;
            }
        }
        console.log("minDelta = " + minDelta + "; indx = " + index_minDelta);
        // Calculate Qi for left-var from deltas
        for (let i=0; i<document.getElementById('lim').value; i++) {
            Qi[i] = arr_res[i]/(tableOfSymplx[i][index_minDelta]*1)*1;
        }
        console.log("Qi:" + Qi);
        // Find the lowest Qi
        minQi = null;
        index_minQi = null;
        for (let i=0; i<document.getElementById('lim').value; i++) {
            if (minQi === null && isNaN(Qi[i]*1) === false && Qi[i]*1 > 0) {
                minQi = Qi[i]*1;
                index_minQi = i;
            }
            else if (minQi > Qi[i]*1 && Qi[i] >= 0)  {
                minQi = Qi[i]*1;
                index_minQi = i;
            }
        }
        console.log("minQi = " + minQi + "; indx = " + index_minQi);
        // Eliminate the basis by lowest Qi
        if (index_minQi !== null) {
            NeRaven[index_minQi] = index_minDelta;
            arr_res[index_minQi] = minQi;
            console.log("c-NeRaven:" + NeRaven);
            console.log("c-arr_res:" + arr_res);
            // Delim stroky
            SavedValueA = tableOfSymplx[index_minQi][index_minDelta];
            for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
                tableOfSymplx[index_minQi][i] /= SavedValueA;
            }
            console.log("c-tableOfSymplx:" + tableOfSymplx);
            // Calculate new "arr_res"
            SavedValueA = -1;
            for (let m=0; m<document.getElementById('lim').value; m++) {
                SavedValueA = tableOfSymplx[m][index_minDelta]*1;
                if (m !== index_minQi) {
                    arr_res[m] = (arr_res[m] - (SavedValueA*arr_res[index_minQi]))*1;
                }   
            }
            console.log("arr_res:" + arr_res);
            // Vichitaem stroki
            SavedValueA = -1;
            for (let m=0; m<document.getElementById('lim').value; m++) {
                SavedValueA = tableOfSymplx[m][index_minDelta];
                if (m !== index_minQi) {
                    for (let k=0; k<(document.getElementById('vars').value*1 + ExtraSlotsForTable); k++) {
                        tableOfSymplx[m][k] = tableOfSymplx[m][k] - (tableOfSymplx[index_minQi][k]*SavedValueA);  
                    }
                }   
            } 
        }
        else {
            NoAnswer("\"Qi >=0\" not exists.");
            return 0;
        }
        
        // logs by end cycle
        console.log("tableOfSymplx: " + tableOfSymplx);
        console.log("NeRaven: " + NeRaven);
        console.log("arr_F:" + arr_F);
    }

    console.log("final-tableOfSymplx:");
    console.log(tableOfSymplx);
    console.log("final-NeRaven:");
    console.log(NeRaven);
    console.log("final-arr_F:");
    console.log(arr_F);
    Answer (F, ExtraSlotsForTable, NeRaven, arr_res);                
}
function CheckMinusResults (arr_res, tableOfSymplx, ExtraSlotsForTable) {
    // 1: +minus, +minus_values: continue cycle // 0: +minus, -minus_values :no answer // 2: -minus :broke cycle
    for (let i=0; i<document.getElementById('lim').value*1; i++) {
        // check (-) in arr_res
        if (arr_res[i]*1 < 0) {
            for (let j=0; j<((document.getElementById('vars').value*1)+ExtraSlotsForTable); j++) {
                if (tableOfSymplx[i][j]*1 < 0) return 1;
            }
            return 0;
        }
    }
    return 2;
}
function MaximizationMinimization (deltas, ExtraSlotsForTable) {
    if (deltas[0] === "x") return true; // skip first cycle
    for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
        if (deltas[i]*1 < 0 && document.getElementById('res_main').value === "max") return true;
        if (deltas[i]*1 > 0 && document.getElementById('res_main').value === "min") return true;
    }
    return false;
}
function NoAnswer (text) {
    let answer = document.getElementById("answer");
    answer.innerHTML = "No Answer: " + text;
    return;
}
function Answer (F, ExtraSlotsForTable, NeRaven, arr_res) {
    let answer = document.getElementById("answer");
    if (Math.abs(F - Math.round(F*1)) < 0.001) answer.innerHTML = "<b>F</b> = " + Math.round(F*1) + "\n";
    else answer.innerHTML = "<b>F</b>= " + F + "; ";
    for (let i=0; i<((document.getElementById('vars').value*1)+ExtraSlotsForTable); i++) {
        if (NeRaven.includes(i)) {
            if (Math.abs(arr_res[NeRaven.indexOf(i)] - Math.round(arr_res[NeRaven.indexOf(i)]*1)) < 0.001)
                answer.innerHTML += "<b> X"+i + "</b>= " + Math.round(arr_res[NeRaven.indexOf(i)]*1) + "; ";
            else answer.innerHTML += "<b> X"+i + "</b>= " + arr_res[NeRaven.indexOf(i)]*1 + "; ";
        }
        else answer.innerHTML += "<b> X"+i + "</b>= 0" + "; "; 
    }
    return;
}
function checksCoef() {
    let answer = document.getElementById("answer");
    //check coefficient on limits
    for (let i=0; i<(document.getElementById('vars').value*document.getElementById('lim').value); i++) {
        if (document.getElementById('inp'+i).value === null || document.getElementById('inp'+i).value === "") document.getElementById('inp'+i).value = 0; 
        if (isNaN(document.getElementById('inp'+i).value)) {
            alert("Ошибка. Обнаружен нечисловой коэффициент.\nПроверьте числовые значения коэффициентов");
            answer.innerHTML = '';	// clear the space
            return 0;
        }
    }
    // check coefficient on main-F
    for (let i=0; i<document.getElementById('vars').value; i++) {
        if (document.getElementById('inp_main'+i).value === null || document.getElementById('inp_main'+i).value === "") document.getElementById('inp_main'+i).value = 0;
        if (isNaN(document.getElementById('inp_main'+i).value)) {
            alert("Ошибка. Обнаружен нечисловой коэффициент.\nПроверьте числовые значения коэффициентов");
            answer.innerHTML = '';	// clear the space
            return 0;
        }
    }
    // checks coefficient on results
    for (let i=0; i<document.getElementById('lim').value; i++) {
        if (document.getElementById('res'+i).value === null || document.getElementById('res'+i).value === "") document.getElementById('res'+i).value = 0;
        if (isNaN(document.getElementById('res'+i).value)) {
            alert("Ошибка. Обнаружен нечисловой коэффициент.\nПроверьте числовые значения коэффициентов");
            answer.innerHTML = '';	// clear the space
            return 0;
        }
    }
    answer.innerHTML = '';	// clear the space
}
function butclick() {
    event.preventDefault();
    // vars check
    if (isNaN(document.getElementById('vars').value) || document.getElementById('vars').value <= 0) {
        alert("Ошибка. Введите числовое значение, больше нуля, в поле \"Количество переменных\"");
        return;
    }
    // limits check
    if (isNaN(document.getElementById('lim').value) || document.getElementById('lim').value <= 0) {
        alert("Ошибка. Введите числовое значение, больше нуля, в поле \"Количество ограничений\"");
        return;
    }
    // if 'OK'  
    if ((isNaN(document.getElementById('vars').value) === false && document.getElementById('vars').value > 0) 
        && (isNaN(document.getElementById('lim').value) === false && document.getElementById('lim').value > 0)) {
        //alert("true");
        var element;
        var container = document.getElementById("container");
        container.innerHTML = '';   // clear the space
        container.innerHTML = "Целевая функция: <br>";
        // vars for F
        for (let j=0; j<document.getElementById('vars').value; j++) {
            element = document.createElement("input");
            element.setAttribute("type", "text");
            element.setAttribute("id", "inp_main"+j);
            element.setAttribute("size", "4");
            container.appendChild(element);
            container.innerHTML += " X"+(j+1) + " ";
            if (j+1<document.getElementById('vars').value) container.innerHTML += " + ";
            else container.innerHTML += " → ";
        }
        // result for F
        element = document.createElement("select");
        element.setAttribute("id", "res_main");
        element.innerHTML += "<option value=\"min\">min</option>\n<option value=\"max\">max</option>";
        container.appendChild(element);
        // limits
        container.innerHTML += "<br> Ограничения: <br>";
        // vars for limits
        for (let i=0; i<document.getElementById('lim').value; i++) {
            for (let j=0; j<document.getElementById('vars').value; j++) {
                element = document.createElement("input");
                element.setAttribute("type", "text");
                element.setAttribute("id", "inp"+((document.getElementById('vars').value*i)+j));
                element.setAttribute("size", "4");
                container.appendChild(element);
                container.innerHTML += " X"+(j+1) + " ";
                if (j+1<document.getElementById('vars').value) container.innerHTML += " + ";
            }
            // ≤ = ≥ for limits
            element = document.createElement("select");
            element.setAttribute("id", "sel"+i);
            element.innerHTML += "<option value=\"≤\">≤</option>\n<option value=\"=\">=</option>\n<option value=\"≥\">≥</option>";
            container.appendChild(element);
            container.innerHTML += " ";
            // result for limits
            element = document.createElement("input");
            element.setAttribute("id", "res"+i);
            element.setAttribute("size", "4");
            container.appendChild(element);
            container.appendChild(document.createElement("br"));
        }
        // solve button
        element = document.createElement("button");
        element.setAttribute("style", "background-color:rgb(255, 0, 0); color: rgb(255, 255, 255); margin-bottom:10px; margin-top:10px;");
        element.setAttribute("onclick", "main();");
        element.innerText = "Решить";
        container.appendChild(element); 
    }   
} 
   