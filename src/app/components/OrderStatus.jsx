import React from 'react'
import { connect } from 'react-redux'
import { compose, setDisplayName, withProps, withHandlers } from 'recompose'
import { createStructuredSelector } from 'reselect'
import {
  Card, CardHeader, CardBody, CardTitle, CardText, Button
} from 'reactstrap'

import toastr from 'Utilities/toastrWrapper'

import { getCurrentSwundleStatus } from 'Selectors'
import { forgetCurrentOrder } from 'Actions/swap'

import withToggle from 'Hoc/withToggle'
import Spinner from 'Components/Spinner'
import OrderStatusModal from 'Components/OrderStatusModal'

const statusRenderData = {
  pending: {
    title: (<span className='text-muted'>Processing <Spinner inline size='sm'/></span>),
    description: 'Your order is being processed.',
  },
  failed: {
    title: (<span className='text-warning'>Failed <i className='fa fa-exclamation-circle' /></span>),
    description: 'There was an issue with one or more swaps in your order. Click "Details" for more.'
  },
  complete: {
    title: (<span className='text-success'>Complete <i className='fa fa-check-circle'/></span>),
    description: 'The order completed successfully. It may take a short amount of time to see the adjusted balances reflected in your portfolio.'
  },
}

const forgetButtonText = 'Dismiss'

const ForgetOrderPrompt = () => (
  <div className='p-3'>
    Please be aware that <strong>{forgetButtonText}</strong> does not actually cancel an order,
    it justs stops the browser app from tracking the status of the order.
    The order may still process normally.
    Please only proceed if you have been instructed to do so, or you understand the effects.
  </div>
)

export default compose(
  setDisplayName('OrderStatus'),
  connect(createStructuredSelector({
    status: getCurrentSwundleStatus,
  }), {
    forgetCurrentOrder,
  }),
  withToggle('modalOpen'),
  withHandlers({
    handleForget: ({ status, forgetCurrentOrder }) => () => {
      if (status === 'pending') {
        toastr.confirm(null, {
          component: ForgetOrderPrompt,
          onOk: forgetCurrentOrder
        })
      } else {
        forgetCurrentOrder()
      }
    },
  }),
  withProps(({ status }) => statusRenderData[status])
)(({ title, description, isModalOpen, toggleModalOpen, handleForget }) => (
  <Card>
    <CardHeader><CardTitle>Order Status</CardTitle></CardHeader>
    <CardBody>
      <div className='mb-2'>{title}</div>
      <CardText>{description}</CardText>
      <Button color='primary' outline size='sm' onClick={toggleModalOpen}>Details</Button>
      <Button color='link' size='sm' className='mx-3' onClick={handleForget}>{forgetButtonText}</Button>
    </CardBody>
    <OrderStatusModal isOpen={isModalOpen} toggle={toggleModalOpen} />
  </Card>
))