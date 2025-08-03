/// <reference path="cube.js" />
/// <reference path="pathfind.js" />

//seeds that cant be solved atm
// G,R,O,
// G,W,O,
// G,W,G,
// O,Y,Y,R,O,R,W,G,Y,G,B,W,
// Y,O,W,R,G,W,G,R,G,R,B,O,
// B,O,Y,R,B,R,W,B,W,O,R,Y,
// B,Y,B,
// B,Y,W,
// O,Y,B,

var gridsize = 50
var screensize = new Vector(1000,500)
var {canvas,ctxt} = createCanvas(screensize.x,screensize.y)

// Insert canvas into the cube section
document.querySelector('.cube-section').appendChild(canvas)

var cube = new Cube()

// Status indicator functionality
function showStatus(message, type = 'success', duration = 3000) {
    const statusIndicator = document.getElementById('statusIndicator')
    const icons = {
        success: 'fas fa-check',
        error: 'fas fa-exclamation-triangle',
        loading: 'loading'
    }
    
    statusIndicator.innerHTML = type === 'loading' 
        ? `<div class="loading"></div> ${message}`
        : `<i class="${icons[type]}"></i> ${message}`
    
    statusIndicator.style.background = type === 'error' 
        ? 'rgba(255, 107, 107, 0.9)' 
        : 'rgba(78, 205, 196, 0.9)'
    
    statusIndicator.classList.add('show')
    
    if (duration > 0) {
        setTimeout(() => {
            statusIndicator.classList.remove('show')
        }, duration)
    }
}

var rotbtncontainer = document.querySelector('#rotbtncontainer')
var rngseedelement = document.querySelector('#seedvalue')
var erroroutput = document.querySelector('#erroroutput')
cube.RNG.seed = rngseedelement.valueAsNumber
rngseedelement.addEventListener('change', e => {
    cube.RNG.seed = rngseedelement.valueAsNumber
    showStatus('RNG seed updated', 'success', 2000)
})

for(let action of 'F B R L U D'.split(/\s+/)){
    rotbtncontainer.insertAdjacentHTML('beforeend',`<button class="cube-btn">${action}</button>`)
    let btn = rotbtncontainer.lastElementChild
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}
var invrotbtncontainer = document.querySelector('#invrotbtncontainer')
for(let action of 'Fi Bi Ri Li Ui Di'.split(/\s+/)){
    invrotbtncontainer.insertAdjacentHTML('beforeend',`<button class="cube-btn">${action}</button>`)
    let btn = invrotbtncontainer.lastElementChild
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}

var doublerotbtncontainer = document.querySelector('#doublerotbtncontainer')
for(let action of 'F2 B2 R2 L2 U2 D2'.split(/\s+/)){
    doublerotbtncontainer.insertAdjacentHTML('beforeend',`<button class="cube-btn">${action}</button>`)
    let btn = doublerotbtncontainer.lastElementChild
    btn.addEventListener('click',() => {
        cube.apply(action,true,perspectiveSelect.value)
    })
}

function createButton(name,callback,isPrimary = false){
    var specialbuttoncontainer = document.querySelector('#specialbtncontainer')
    const buttonClass = isPrimary ? 'action-btn primary' : 'action-btn'
    specialbuttoncontainer.insertAdjacentHTML('beforeend',`<button class="${buttonClass}">${name}</button>`)
    specialbuttoncontainer.lastElementChild.addEventListener('click', callback)
}

var perspectiveSelect = document.querySelector('#perspectiveSelect')
var outputinput = document.querySelector('#outputinput')

createButton('Reset', e => {
    cube.reset()
    outputinput.value = ''
    showStatus('Cube reset to solved state')
})
createButton('Scramble', e => {
    const moves = cube.scramble()
    outputinput.value = moves
    showStatus('Cube scrambled!')
})
createButton('Solve', e => {
    try {
        showStatus('Solving cube...', 'loading', 0)
        setTimeout(() => {
            try {
                outputinput.value = cube.gensolve()
                erroroutput.innerText = ''
                showStatus('Solution found!')
            } catch (errors) {
                erroroutput.innerText = errors.join('\n')
                showStatus('Solve failed - check errors', 'error')
            }
        }, 100)
    } catch (errors) {
        erroroutput.innerText = errors.join('\n')
        showStatus('Solve failed - check errors', 'error')
    }
}, true)
createButton('Apply', (e) => {
    if (outputinput.value.trim()) {
        cube.apply(outputinput.value,true,perspectiveSelect.value)
        if(e.ctrlKey == false){
            outputinput.value = ''
        }
        showStatus('Moves applied!')
    } else {
        showStatus('No moves to apply', 'error', 2000)
    }
}, true)
createButton('Apply1', e => {
    if (outputinput.value.trim()) {
        cube.apply(take1fromoutputinput(),true,perspectiveSelect.value)
        showStatus('Single move applied')
    } else {
        showStatus('No moves to apply', 'error', 2000)
    }
})
createButton('Auto Solve', e => {
    showStatus('Auto-solving...', 'loading', 0)
    setTimeout(() => {
        cube.apply(cube.scramble())
        try {
            var out = cube.gensolve()
            cube.apply(out)
            outputinput.value = out
            erroroutput.innerText = ''
            showStatus('Auto-solve complete!')
        } catch (errors) {
            erroroutput.innerText = errors.join('\n')
            showStatus('Auto-solve failed', 'error')
        }
    }, 100)
}, true)

document.addEventListener('keydown',e => {
    var keymap = {
        'KeyU':'U',
        'KeyF':'F',
        'KeyD':'D',
        'KeyL':'L',
        'KeyB':'B',
        'KeyR':'R',
    }
    if(keymap[e.code] && document.activeElement != outputinput){
        cube.apply(keymap[e.code],true,perspectiveSelect.value)
    }
})

loop((dt) => {
    ctxt.fillStyle = 'black'
    ctxt.fillRect(0,0,screensize.x,screensize.y)

    drawCube(cube,ctxt)
})

// Show welcome message when everything is loaded
setTimeout(() => {
    showStatus('Welcome! Cube is ready to solve')
}, 500)

function drawCube(cube,ctxt){
    for(var face of cube.cubeletFaces){
        var pos2d = cube.convert3dto2d(face.parent.pos,face.normal)
        var abs = pos2d.c().scale(gridsize)
        ctxt.fillStyle = face.color
        ctxt.fillRect(abs.x,abs.y,gridsize,gridsize)
        // ctxt.fillStyle = 'black'
        // ctxt.textAlign = 'center'
        // ctxt.textBaseline = 'middle'
        // ctxt.fillText(`${pos2d.x},${pos2d.y}`,abs.x + gridsize / 2,abs.y + gridsize / 2)
    }
}

function take1fromoutputinput(){
    var index = outputinput.value.search(/\s+/)
    var out = outputinput.value.substr(0,index)
    outputinput.value = outputinput.value.substr(index).trim()
    return out
}
