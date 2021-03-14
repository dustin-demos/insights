
import { a, div, h1, p, text } from '../lib/vnodes/html'

import * as fb from '../stores/facebook'

import main from './_main'
import * as chart from './chart'
const Chart = chart.chart

const Text = (h, data) => h([text(data)])

const Posts = data => {
  const posts = data.insights.data

  if (data.insights.success == null) {
    return // do nothing
  }

  const target = []

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i]
    const row = []

    for (const key in item) {
      row.push(div([text(item[key])]))
    }

    target.push(div({ class: 'posts-row' }, row))
  }

  return div({ class: 'posts' }, target)
}

const PromptView = data => {
  const { accounts, igAccount, login, me } = data

  if (data.login.loading || data.prompt.loading) {
    return [
      div({ class: '_spinner' })
    ]
  }

  // Step 4
  if (igAccount.success) {
    return [
      div({ class: 'prompt-body' }, [
        Text(h1, 'All systems go!'),
        Text(p, 'Now let\'s import some data! This could take a moment or two to process.')
      ]),
      a({ onclick: data.onImport }, [
        text('Let\'s go!')
      ])
    ]
  }

  // Step 3
  if (accounts.success) {
    const accounts = data.accounts.data.data
    const list = []

    for (let i = accounts.length; i--;) {
      const { category_list: tags, name, id } = accounts[i]
      const categories = tags.map(tag => tag.name).join(', ')

      const item = div({
        class: data.prompt.active === id
          ? 'account-item -active'
          : 'account-item',
        onclick: () => {
          data.onselect(id)
        }
      }, [
        div({
          class: 'account-avatar',
          style: `background-image: url('https://graph.facebook.com/${id}/picture?type=normal')`
        }),
        div({ class: 'account-details' }, [
          Text(h1, name),
          Text(div, categories)
        ])
      ])

      list.push(item)
    }

    return [
      div({ class: 'prompt-body' }, [
        Text(h1, 'Which account?')
      ]),
      div({ class: 'account-list' }, list),
      a({
        class: data.prompt.active === null ? '-disable' : '',
        onclick: data.onConfirmAccount
      }, [
        text('Confirm')
      ])
    ]
  }

  // Step 2
  if (login.success && me.success) {
    const name = data.me.data.first_name
    const id = data.me.data.id

    return [
      div({
        class: 'prompt-avatar',
        style: `background-image: url('https://graph.facebook.com/${id}/picture?type=normal');`
      }),
      div({ class: 'prompt-body' }, [
        Text(h1, 'Hello, ' + name + '!'),
        Text(p, 'Let\'s get to it. Start by confirming that this account belongs to you.')
      ]),
      a({ onclick: data.onConfirmIdentiy }, [
        text('Yep, it\'s me.')
      ])
    ]
  }

  // Step 1
  return [
    div({ class: 'prompt-body' }, [
      Text(h1, 'Instagram Insights'),
      Text(p, 'First things first, we need access to a Facebook account that\'s connected to a Business Instagram account.')
    ]),
    a({ class: '-facebook', onclick: data.onlogin }, [
      text('Continue with Facebook')
    ])
  ]
}

const xHead = (state, dispatch) => () => {
  if (state.fbMe.success && state.prompt.success) {
    const id = state.fbMe.data.id
    const name = state.fbMe.data.first_name
    const instaID = state.prompt.active

    const logout = () => {
      dispatch(state => {
        state.foo.persist = false
        return { foo: state.foo }
      })
      sessionStorage.removeItem('state')
      dispatch(fb.logout)
    }

    return div({ class: 'insights-head' }, [
      div({
        class: 'avatar',
        style: `background-image: url('https://graph.facebook.com/${id}/picture?type=normal')`
      }),
      div({
        class: 'avatar -instagram',
        style: `background-image: url('https://graph.facebook.com/${instaID}/picture?type=normal')`
      }),
      text(`${name} / ${state.prompt.account.name}`),
      a({
        class: '-refresh',
        onclick: () => {
          dispatch(fb.insights, {
            id: state.igAccount.data.instagram_business_account.id
          })
        }
      }, [
        text('Refresh')
      ]),
      a({ class: '-logout -facebook', onclick: logout }, [
        text('Logout')
      ])
    ])
  }
}

const Prompt = data => {
  if (data.insights.success == null) {
    return div({ class: 'prompt-wrap' }, [
      div({ class: 'prompt' }, PromptView(data))
    ])
  }
}

const Insights = register => {
  return (state, dispatch) => {
    const Head = xHead(state, dispatch)

    return div({ class: 'insights-old' }, [
      Head(),
      div([
        Prompt({
          // media: state.media,
          accounts: state.fbAccounts,
          igAccount: state.igAccount,
          insights: state.insights,
          login: state.fbLogin,
          me: state.fbMe,
          prompt: state.prompt,
          onlogin: async () => {
            await dispatch(fb.login)
            await dispatch(fb.me)
          },
          onConfirmIdentiy: () => {
            dispatch(fb.accounts)
          },
          onselect: active => {
            dispatch(({ prompt }) => {
              prompt.active = prompt.active === null ? active : null
              return { prompt }
            })
          },
          onConfirmAccount: () => {
            dispatch(fb.igAccount)
            dispatch(({ prompt }) => {
              prompt.success = true
              return { prompt }
            })
          },
          onImport: () => {
            dispatch(({ prompt }) => {
              prompt.loading = true
              return { prompt }
            })

            // TODO
            // + Learn how to await dispatches
            //
            // await dispatch(fb.media, {
            //   id: state.igAccount.data.instagram_business_account.id
            // })
            //
            // await dispatch(fb.insights, {
            //   media: state.media.data
            // })

            dispatch(fb.insights, {
              id: state.igAccount.data.instagram_business_account.id
            })
          }
        }),
        Chart({ insights: state.insights }),
        Posts({ insights: state.insights })
      ])

    ])
  }
}

export default {
  view: register => main(Insights(register)),
  onroute: (actions, register) => {
    // <!-- register actions here --->

    return (state, dispatch) => {
      // Facebook SDK
      window.fbAsyncInit = () => {
        FB.init({ appId: '813793032539615', cookie: true, version: 'v10.0' })
        FB.AppEvents.logPageView()
        dispatch(fb.loginStatus)
      }
    }
  }
}
