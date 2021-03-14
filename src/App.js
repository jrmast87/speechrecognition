import React, { useState, useEffect } from 'react'
import './App.css'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

function App() {
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  const [savedNotes, setSavedNotes] = useState([])
  const [vocabMap, setVocabMap] = useState([])

  var passage = 'I like green eggs and ham'
  var passageWords = passage.split(" ")
  var count = Object.keys(passageWords).length
  console.log(count)
  for(let i = 1; i <= count; i++) {
    console.log(passageWords[i]);
  }

  var vocabWords = []
  //var vocabMap = vocabWords.map((vocabWord) => vocabWord)

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    console.log('saved note ' + note + ' saved')
    var speech = note.split(" ")
    var count = Object.keys(speech).length
    console.log(count)
    for(let i = 0; i < count; i++) {
      console.log(speech[i]);
      console.log(passageWords[i]);
      console.log(typeof(savedNotes))
      if(speech[i] === passageWords[i]) {
        console.log('Match!')
      } else {
        //vocabWords.push(passageWords[i])
        vocabWords.push(passageWords[i])
        console.log(vocabWords)
      }
    }

    if(vocabWords.length < 1) {
      vocabWords.push('No new Words!')
      console.log(vocabWords)
    } 
    setVocabMap(vocabWords)
    console.log('vocabmap ' + vocabMap)
    setNote('')
  }

  

  return (
    <>
      <h1>Voice Notes</h1>
      <div className="container">
        <div className="box">
          <h2>Read the Passage!</h2>
          <p>I like green eggs and Ham!</p>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>New Practice Words</h2>
            {vocabMap.map(n => (
              <p key={n}>{n}</p>
            ))}
        </div>
      </div>
    </>
  )
}

export default App
