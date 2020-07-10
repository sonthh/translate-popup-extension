import React, { Component } from 'react';
import './App.scss';
import * as api from './api.js';
import Player from './components/Player';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showImages: localStorage.getItem('showImages') === 'false' ? false : true,
      word: null,
      result: [],
      previousResult: [],
      previousWord: null,
      imageSearch: null,
    }
  }

  componentDidMount() {
    this.nameInput.focus();

    const doubleClick = () => {
      const word = window.getSelection().toString();

      if (!word || word === '') {
        return;
      }

      this.setState({ word });
      this.fetchWord({ word });

      const { showImages } = this.state;
      if (showImages === true) {
        this.fetchImages(word);
      }
    }
    document.body.addEventListener('dblclick', doubleClick);
  }

  onTranslate = () => {
    const { word, showImages } = this.state;
    this.fetchWord({ word });
    if (showImages === true) {
      this.fetchImages(word);
    }
  };

  onInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'showImages') {
      let { showImages } = this.state;
      showImages = !showImages;

      this.setState({ showImages });
      localStorage.setItem('showImages', showImages);
    } else {
      this.setState({ [name]: value });
    }
  }

  fetchWord = async (params) => {
    try {
      const data = await api.getWord(params);

      const x = data.results[0];

      const { lexicalEntries } = x;

      const { result: currentResult } = this.state;

      this.setState({ previousResult: currentResult, previousWord: currentResult[0]?.text });
      this.setState({ result: lexicalEntries });

      // this.saveLocalStorage(lexicalEntries);

    } catch (err) {
      console.log(err);
      this.setState({ result: [] });
    }
  }

  // saveLocalStorage = (result) => {
  //   try {
  //     let item = {};
  //     item['lexicalEntries'] = [];

  //     result.forEach(each => {
  //       let { lexicalCategory, text, entries } = each;

  //       entries = entries.map(each => {
  //         let entry = {};
  //         const { pronunciations, senses } = each;

  //         senses.forEach(each => {
  //           const { definitions } = each;
  //           entry['definitions'] = definitions;
  //         });

  //         entry['pronunciation'] = pronunciations[1].phoneticSpelling;
  //         entry['lexicalCategory'] = lexicalCategory.text;
  //         entry['audioFile'] = pronunciations[1].audioFile;

  //         return entry;
  //       });

  //       let lexicalEntry = {
  //         entries,
  //         text,
  //       };

  //       item['lexicalEntries'].push(lexicalEntry);
  //     })

  //     let json = localStorage.getItem('vocabularies');
  //     let vocabularies = JSON.parse(json) || [];
  //     vocabularies = [item].concat(vocabularies);
  //     if (vocabularies.length > 10) {
  //       vocabularies.pop();
  //     }
  //     localStorage.setItem('vocabularies', JSON.stringify(vocabularies));

  //   } catch (err) { }
  // }

  fetchImages = async (keyWord) => {
    try {
      const data = await api.searchImages(keyWord);
      this.setState({ imageSearch: data });

    } catch (err) {
      console.log(err);
    }
  }

  onBack = () => {
    const { previousResult, previousWord } = this.state;
    this.setState({
      result: previousResult,
      word: previousWord,
      //  previousResult: result, 
      //  previousWord: word 
    });
  }

  onKeyPress = event => {
    if (event.key === 'Enter') {
      const { word, showImages } = this.state;
      this.fetchWord({ word });
      if (showImages === true) {
        this.fetchImages(word);
      }
    }
  }

  onFocus = (e) => {
    e.target.select();
  }

  render = () => {
    const { word, result, imageSearch, showImages } = this.state;
    let content = null;
    let images = null;

    try {
      const { items } = imageSearch;
      images = showImages === true ? items.map(each => {
        return (
          // eslint-disable-next-line react/jsx-no-target-blank
          <a target='_blank' href={each.image.contextLink}>
            <img src={each.image.thumbnailLink} title={each.snippet} alt={each.snippet} />
          </a>
        )
      }) : null;
    } catch (err) {
    }

    try {
      content = result.map(each => {
        const { lexicalCategory, text, entries } = each;

        const xxx = entries.map(each => {
          const { pronunciations, senses } = each;

          const defs = senses.map(each => {
            const { definitions } = each;
            const kkk = definitions.map(each => {
              return (
                <p className='defination'>● {each}</p>
              )
            });

            return kkk;
          });

          return (
            <>
              <span> /{pronunciations[1].phoneticSpelling}/</span>
              <span className='three-dots'>●●●</span>
              <span className='lexical-category'>{lexicalCategory.text}</span>
              <Player url={pronunciations[1].audioFile} />
              {defs}
            </>
          );

        });

        return (
          <div>
            <span className='word'>{text}</span>{xxx}
            <hr />
          </div>
        );
      })
    } catch (e) {
      content = 'Check your word!'
    }
    return (
      <div className='app'>
        <div className='translator'>
          <input
            autoComplete='off'
            placeholder='Enter the word'
            onKeyPress={this.onKeyPress}
            onChange={this.onInputChange}
            name='word'
            value={word || ''}
            onFocus={this.onFocus}
            ref={(input) => { this.nameInput = input; }}
          />
          <button className='btn-translate' onClick={this.onTranslate}>Translate</button>
          <button className='btn-back' onClick={this.onBack}>Back</button>
        </div>
        <div className='result'>
          {content}
        </div>
        <div className='images'>
          {images}
        </div>
        <div className='setting'>
          <input
            name='showImages'
            defaultChecked={showImages}
            value={showImages}
            onChange={this.onInputChange}
            type='checkbox' />
            Images
        </div>
        <div className='footer'>
          <a title='Contact with me' href='mailto:tranhuuhongson@gmail.com'>tranhuuhongson@gmail.com</a>
        </div>
      </div>
    );
  }
}
