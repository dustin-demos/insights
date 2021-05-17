
import { a, div, h1, h2, p, text } from '../pocket/tags/html'
import * as prompt from '../stores/prompt'
import * as sources from '../stores/sources'

const h = (tag, data) => tag([text(data)])

const Continue = props => {
  return [
    div({ class: 'card-graphic' }),
    div({ class: 'card-main' }, [
      h(h1, 'Onclick Insights'),
      h(h2, 'Instagram Analytics for Business'),
      h(p, 'First things first, we need access to a Facebook account that\'s connected to a Business Instagram account.')
    ]),
    div({ class: 'card-button' }, [
      a({ class: '-facebook', onclick: props.onNext }, [
        text('Continue with Facebook')
      ])
    ])
  ]
}

const ConfirmIdentity = props => {
  return [
    div({
      class: 'card-avatar',
      style: `background-image: url('https://graph.facebook.com/${props.id}/picture?type=large');`
    }),
    div({ class: 'card-body' }, [
      h(h1, 'Hello, ' + props.name + '!'),
      h(p, 'Please click this button to confirm that this account belongs to you.')
    ]),
    div({ class: 'card-button' }, [
      a({ onclick: props.onNext }, [
        text('Yep, that\'s me.')
      ])
    ])
  ]
}

const SelectAccount = props => {
  const accounts = props.accounts
  const list = []

  for (let i = accounts.length; i--;) {
    const { category_list: tags, name, id } = accounts[i]
    const categories = tags.map(tag => tag.name).join(', ')

    const item = div({
      class: props.active === id ? 'account-item -active' : 'account-item',
      onclick: () => {
        props.onSelect(id)
      }
    }, [
      div({
        class: 'account-avatar',
        style: `background-image: url('https://graph.facebook.com/${id}/picture?type=normal')`
      }),
      div({ class: 'account-details' }, [
        h(h1, name),
        h(div, categories)
      ])
    ])

    list.push(item)
  }

  return [
    div({ class: 'card-body' }, [
      h(h1, 'Which account?')
    ]),
    div({ class: 'account-list' }, list),
    div({ class: 'card-button' }, [
      a({
        class: props.active === null ? '-disable' : '',
        onclick: props.onNext
      }, [
        text('Confirm')
      ])
    ])
  ]
}

const Finish = props => {
  return (
    <div>
      <div class='card-body'>
        <h1>All systems go!</h1>
        <p>Now let's import some data. This could take a moment to process.</p>
      </div>
      <div class='card-button'>
        <a onclick={props.onNext}>Let's Go!</a>
      </div>
    </div>
  )
}

const Error = () => {
  return [
    text('Something went wrong...')
  ]
}

const steps = (state, dispatch) => {
  return [
    () => Error(),
    () => Continue({
      onNext: () => {
        dispatch(prompt.continueWith)
      }
    }),
    () => ConfirmIdentity({
      id: state.facebook.me.data.id,
      name: state.facebook.me.data.first_name,
      onNext: () => {
        dispatch(prompt.confirmIdentity)
      }
    }),
    () => SelectAccount({
      active: state.prompt.accountID,
      accounts: state.facebook.accounts.data.data,
      onSelect: id => {
        dispatch(prompt.select, id)
      },
      onNext: () => {
        dispatch(prompt.confirmAccount)
      }
    }),
    () => Finish({
      onNext: () => {
        dispatch(prompt.letsGo, {
          callback: data => {
            dispatch(sources.importInstagram, {
              date: Date.now(),
              name: '<insert account name here>',
              posts: data
            })
          }
        })
      }
    })
  ]
}

export default (state, dispatch) => {
  const Steps = steps(state, dispatch)
  const { login, me, accounts, instagram, insights } = state.facebook

  const status = [
    login.loading,
    me.loading,
    accounts.loading,
    instagram.loading,
    insights.loading
  ]

  const slot = status.includes(true)
    ? <div class='_spinner'></div>
    : Steps[state.prompt.step]()

  return (
    <div class='home'>
      <div class='card'>{slot}</div>
    </div>
  )
}
