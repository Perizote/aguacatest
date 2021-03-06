import React, { Component, Fragment } from 'react'

export class Cart extends Component {
  state = {
    products: 10,
  }

  add = () => {
    this.setState(({ products }) => ({ products: products + 1 }))
  }

  remove = () => {
    this.setState(({ products }) => ({ products: products - 1 }))
  }

  render = () => {
    return (
      <Fragment>
        <button onClick={ this.remove }>-</button>
        <span data-test="products">{ this.state.products }</span>
        <button aria-label="add" onClick={ this.add }>+</button>
      </Fragment>
    )
  }
}