import React, { Component } from 'react';
import { render } from 'react-dom';
import glamorous from 'glamorous';
const { H1, Img, A } = glamorous;

// Import the glamorous components for the page.
import {
  Background, 
  Content,
  Heading,
  SubHeading,
  SocialLinks
} from './PageComponents'

// Global overrides for body & a tag
import './style.css';

import {
  Map,
  List
} from 'immutable';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import { Graph } from 'react-d3-graph';

// graph payload (with minimalist structure)
const data = {
    nodes: [{ id: 'Harry' }, { id: 'Sally' }, { id: 'Alice' }],
    links: [{ source: 'Harry', target: 'Sally' }, { source: 'Harry', target: 'Alice' }]
};

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        size: 120,
        highlightStrokeColor: 'blue'
    },
    link: {
        highlightColor: 'lightblue'
    }
};
const defaultNode = {
    id: "0"
  }
class App extends Component {
  state = {
    nodes: List([
      defaultNode
    ]),
    edges: List(),
    
    selection: List()
  }

  onClickGraph = () => {
    // create a node
    console.log(arguments)
  }

  createNode = () => {
    let {nodes} = this.state;
    let pos = [
      0,
      0
    ];
    let node = {
      id: `${+nodes.get(-1, defaultNode).id + 1}`,
    }
    this.setState({
      nodes: nodes.push(node),
    })
  }

  selectNode = (selected) => {
    let selection = this.state.selection;
    let selection_;
    if(selection.size > 1) {
      selection_ = selection.push(selected).shift()
    } else {
      selection_ = selection.push(selected);
    }
    this.setState({ selection: selection_ })
  }

  connectNode = () => {
    if(this.state.selection.count() != 2) return;
    let selected = this.state.selection.toArray();
    this.setState({
      edges: this.state.edges.push({
        source: selected[0],
        target: selected[1]
      })
    })
  }

  getData = () => {
    let selection = this.state.selection.toJS();
    return {
      nodes: this.state.nodes.map(({id}) => {
        return {
          id,
          color: selection.indexOf(id) > -1 ? 'red' : 'blue'
        }
      }).toJS(),
      links: this.state.edges.toJS()
    }
  }

  render() {
    return (
      <Background>
        <Content>
          <p>
          selected: {this.state.selection.join(',')}
          </p>

          <button onClick={this.createNode}>Create node</button>
          <button onClick={this.connectNode}>Connect node</button>
          <button onClick={() => {
            let { nodes, edges } = JSON.parse(prompt("paste json", ""))
            this.setState({
              nodes: List(nodes).sortBy(n => n.id),
              edges: List(edges)//.sortBy(e => e.id)
            })
          }}>Import JSON</button>

        <CopyToClipboard text={this.state.json}>
          <button onClick={() => {
            
            let json = JSON.stringify({
              nodes: this.state.nodes.toJSON(),
              edges: this.state.edges.toJSON()  
            })

            this.setState({ json })

          }}>Export JSON (click twice)</button>
        </CopyToClipboard>

          <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={this.getData()}
              config={myConfig}
              onClickNode={this.selectNode}
              onClickGraph={this.onClickGraph}
              // onClickLink={onClickLink}
              // onMouseOverNode={onMouseOverNode}
              // onMouseOutNode={onMouseOutNode}
              // onMouseOverLink={onMouseOverLink}
              // onMouseOutLink={onMouseOutLink}
          />
        </Content>
      </Background>
    );
  }
}

render(<App />, document.getElementById('root'));
