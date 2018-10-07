import glamorous from 'glamorous';

const Background = glamorous.div({
  height:'100vh',
  width:'100%',
  position: 'fixed',
  fontFamily: 'Lato'
})

const Content = glamorous.div({
  padding: '15px',
  height: '100%'
})


export {
  Background, 
  Content,
} 