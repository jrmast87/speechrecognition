import React, { useState, useEffect } from 'react'
import './App.css'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"
//import {Image, TouchableOpacity} from 'react-native'

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


  var greeneggs = 'I like green eggs and ham'
  
  var goodnightMoon = 'In the great green room There was a telephone And a red balloon And a picture of The cow jumping over the moon And there were three little bears sitting on chairs And two little kittens And a pair of mittens And a little toy house And a young mouse And a comb and a brush and a bowl full of mush And a quiet old lady who was whispering “hush” Goodnight room Goodnight moon Goodnight cow jumping over the moon Goodnight light And the red balloon Goodnight bears Goodnight chairs Goodnight kittens And goodnight mittens Goodnight clocks And goodnight socks Goodnight little house And goodnight mouse Goodnight comb And goodnight brush Goodnight nobody Goodnight mush And goodnight to the old lady whispering “hush” Goodnight stars Goodnight air Goodnight noises everywhere'
  var passage = goodnightMoon
  var passageWords = passage.split(" ")

  
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
    var vocabWords = passageWords
    var passageCount = Object.keys(passageWords).length
    setSavedNotes([...savedNotes, note])
    var speech = note.split(" ")
    var count = Object.keys(speech).length
    for(let i = 0; i < count; i++) {
      for(let j = 0; j < passageCount; j++) {
        if(vocabWords[j] === speech[i]) {
          console.log(vocabWords[j] + ' and ' + speech[i])
          vocabWords.splice(j, 1); 
          console.log('spliced')
        }
      }
    }
    
    if(vocabWords.length < 1) {
      vocabWords.push('No new Words!')
      console.log(vocabWords)
      setVocabMap(vocabWords)
      console.log('vocabmap ' + vocabMap)
    } else {
      let noDupWords = [...new Set(vocabWords)]
      setVocabMap(noDupWords)
    }
    
    setNote('')
  }

  const goodnightMoonMethod = () => {
    passage = goodnightMoon
  }

  const greenEggsMethod = () => {
    passage = greeneggs
  }

  return (
    <>
      <h1>Stories</h1>
      <img src="../goodnight-moon.jpg" alt="placeholder" onClick={goodnightMoonMethod}/>
      <img src="../greeneggs.jpg" alt="placeholder" onClick={greenEggsMethod}/>
      <div className="container">
        <div className="box">
          <h2>Read the Passage</h2>
          {isListening ? <span>🎙️</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save Note
          </button>
          <button onClick={() => setIsListening(prevState => !prevState)}>
            Start/Stop
          </button>
          <div>
            <p>{passage}</p>
          </div>
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
