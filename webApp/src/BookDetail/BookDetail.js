import React from 'react';
import {StyleSheet, css} from "aphrodite";
import Rx from 'rxjs';
import BookNotes from "./BookNotes/BookNotes";
import ActionBar from "./ActionBar/ActionBar";

const styles = StyleSheet.create({
  title:{
    margin: 0,
  },
  author:{
    marginTop: 0,
  },
  coverImage:{
    minHeight: '45vh',
    maxWidth: '100%',
    padding: '0 10px',
  },
  flexParent:{
    display: 'flex',
    flexWrap: 'wrap',
  },
  flexHorizontal:{
    marginTop: 24,
    justifyContent: 'space-around',
  },
  flexVertical:{
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '45vw',
    width: '35vw',
    padding: '20px',
  },
  loadingImage:{
    width: 350,
    height: 519,
    backgroundColor: 'beige',
    margin: '0 10px',
    display: 'inline-block',
  },
  format:{
    fontStyle: 'italic',
  }
});

class BookDetail extends React.Component {
  books = [];

  toggleOwned(){
    console.log('Owned: ', this.state.owned);
    this.setState({owned:!this.state.owned});
  }

  updateRating(rating){
    console.log('Updating that gosh darn rating to ', rating);
    this.setState({rating: rating});
  }

  constructor(props){
    super(props);
    this.state = {
      owned: false,
      rating: 0,
      format: 'Hardcover'
    };
    Rx.Observable.ajax({url: `http://openlibrary.org/search.json?q=` + props.query.split(' ').join('+'), crossDomain: true})
       .map(res => res.response.docs)
       .map(books => {
         console.log(books);
         return books.map(book =>{
           let key = 'ID';
           let value = book.cover_i;
           let size = 'L';
           return {
             author: book.author_name? book.author_name[0] : 'Anonymous',
             title: book.title,
             coverUrl: `http://covers.openlibrary.org/b/${key}/${value}-${size}.jpg`,
             isbn: book.isbn,
           }
         });
       })
       .flatMap(books =>{
         this.setState(books[0]);
         // Get google books result for description.
         return Rx.Observable.ajax({url: `https://www.googleapis.com/books/v1/volumes?q=isbn:${books[0].isbn[0]}`, crossDomain: true});
       })
       .subscribe(books => {
         console.log(books);
         this.setState({description: books.response.items[0].volumeInfo.description});
       },
       err=>{
         console.error('My Library Error: ', err);
       });
  }

  render(){
    return(
       <section className={css(styles.flexParent, styles.flexHorizontal)}>
         {
           this.state.coverUrl ?
              <img src={this.state.coverUrl} className={css(styles.coverImage)} alt='Cover' />
              :
              <div className={css(styles.loadingImage)}>Loading...</div>
         }
         <div className={css(styles.flexParent, styles.flexVertical)}>
           {(this.state.title && this.state.author) ? (
              <section>
                <h3 className={css(styles.title)}>{this.state.title}</h3>
                <h4 className={css(styles.author)}>by {this.state.author}</h4>
              </section>) : <span>Loading...</span>
           }
           <span>{this.state.description}</span>
           <span className={css(styles.format)}>Format: {this.state.format}</span>
           {this.state.owned ? <BookNotes editing="true" label="Private Notes" content={this.state.notes} />: ''}
         </div>
         {/*<label htmlFor="toggleowned">Toggle Owned</label>*/}
         {/*<input type="checkbox" onClick={this.toggleOwned.bind(this)} name="toggleowned"/>*/}
         <ActionBar
            numberOfCopies={2}
            owned={this.state.owned}
            rating={this.state.rating}
            onAddToLibrary={this.toggleOwned.bind(this)}
            onRemoveFromLibrary={this.toggleOwned.bind(this)}
            onUpdateRating={(rating) => this.updateRating(rating)}
         />
       </section>
    )
  }
}

export default BookDetail;