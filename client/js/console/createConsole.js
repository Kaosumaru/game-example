/**
 * Created by odrin on 14.09.2015.
 */
'use strict'
/*global PIXI */
/*global EZGUI */

module.exports = function createConsole(spec){
    const graphicsCtx = spec.graphicsCtx
    const emiter = spec.emiter
    const renderer = graphicsCtx.renderer
    const stage = graphicsCtx.stage
    const numberOfLines = spec.numberOfLines || 11
    const maxLineLength = spec.maxLineLength || 60

    let inputListener = ()=>{}
    const guiConsole = new PIXI.Container()
    guiConsole.visible = false
    const lines = []
    const history = []
    let historyPointer = 0

    for(let i=numberOfLines;i>0;--i){
        const line = new PIXI.Text('',{font : '20px Arial', fill : 0xffffff, align : 'center'});
        line.position.x = 15
        line.position.y = 10 + i*25
        lines.push(line);
        guiConsole.addChild(line)
    }

    const guiBtn = {
        id: 'sendButton',
        text: 'Send',
        component: 'Button',
        skin: 'bluebutton',
        padding: 4,
        position: { x: 535, y: 315 },
        width: 90,
        height: 30
    }

    const guiInput = {
        id: 'commandInput',
        text: '',
        component: 'Input',
        position: { x: 10, y: 315 },
        width: 520,
        height: 30
    }

    const commit = () => {
        history.push(EZGUI.components.commandInput.text)
        historyPointer = history.length
        inputListener(EZGUI.components.commandInput.text)
        EZGUI.components.commandInput.text = ''
    }

    EZGUI.renderer = renderer;
    EZGUI.Theme.load(['/assets/ezgui/kenney-theme/kenney-theme.json'], function () {
        const sendBtn = EZGUI.create(guiBtn, 'kenney')
        const inputBtn = EZGUI.create(guiInput, 'kenney')
        EZGUI.components.sendButton.on('click', function (event) {
            commit()
        })
        guiConsole.addChild(sendBtn)
        guiConsole.addChild(inputBtn)
    })

    stage.addChild(guiConsole)


    emiter.on('r4two:action:console',()=>{
        guiConsole.visible = !guiConsole.visible
        EZGUI.components.commandInput.text = ''
    })

    emiter.on('r4two:action:accept',()=>{
        commit()
    })

    emiter.on('r4two:action:up',()=>{
        historyPointer--
        if(history.length !== 0 && historyPointer < history.length && historyPointer >= 0){
            EZGUI.components.commandInput.text = history[historyPointer]
        } else {
            historyPointer++
        }
    })

    emiter.on('r4two:action:down',()=>{
        historyPointer++
        if(history.length !== 0 && historyPointer >= 0){
            if(historyPointer < history.length){
                EZGUI.components.commandInput.text = history[historyPointer]
            } else {
                EZGUI.components.commandInput.text = ''
                historyPointer = history.length
            }
        } else {
            historyPointer--
        }
    })

    const write = (text)=>{
        for(let i=lines.length-1; i>0;--i){
            lines[i].text = lines[i-1].text
        }
        lines[0].text = text
    }

    return {
        writeLine(text){
            const words = text.split(' ')
            while(words.length !== 0){
                let line = words.splice(0,1);
                while(words.length !== 0 && line.length+words[0].length+1 < maxLineLength){
                    line = line+' '+words.splice(0,1)
                }
                if(line > maxLineLength){
                    const parts = line.slice(maxLineLength)
                    line = parts[0]
                    words.splice(0,0,line[1])
                }
                write(line)
            }
        },
        setInputListener(il){
            inputListener = il
        },
        show(){

        },
        hide(){

        }
    }
}

