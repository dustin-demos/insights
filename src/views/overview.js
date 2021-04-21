
import { button, div, h1, p, text } from '../lib/vnodes/html'
import Main from './_main'

import * as Chart from './chart'

// This menu thing I have going is kind of jank. I'm making `menuOpen` false
// then quickly setting it to true again. This happens super fast so nothing
// needs to re-rendered. I think I should have a better system than this.

const MenuButton = data => {
  return button({
    onclick: () => {
      // console.log('menu onclick')
      data.data.onSelect(data.chartRange)
    },
    onfocusin: () => {
      // console.log('menu onfocusin')
      data.data.onOpen()
    },
    onfocusout: () => {
      // console.log('menu onfocusout')
      data.data.onClose()
    }
  }, [
    text(`Last ${data.chartRange} Posts`)
  ])
}

const Menu = data => {
  return div({ class: 'overview-menu-container' }, [
    button({
      onclick: () => {
        // console.log('container onclick')
        data.onToggleMenu()
      },
      onfocusout: () => {
        // console.log('container onfocusout')
        data.onClose()
      }
    }, [
      text(`Last ${data.chartRange} Posts`)
    ]),
    div({ class: data.menuOpen ? 'overview-menu' : 'overview-menu -hidden' }, [
      MenuButton({ chartRange: 12, data }),
      MenuButton({ chartRange: 24, data }),
      MenuButton({ chartRange: 48, data }),
      MenuButton({ chartRange: 96, data })
    ])
  ])
}

const Card = data => {
  return div({ class: 'overview-card' }, [
    h1([
      text(data.head)
    ]),
    p([
      text(data.content)
    ])
  ])
}

const setMenuOpen = ({ overview }, data) => {
  overview.menuOpen = data
  return { overview }
}

const setChartRange = ({ overview }, data) => {
  overview.chartRange = data
  overview.menuOpen = false // ??? temporary
  return { overview }
}

const Overview = (state, dispatch) => {
  return div({ class: 'overview' }, [
    div({ class: 'overview-head' }, [
      h1([
        text('Hello Dustin')
      ])
    ]),
    div({ class: 'overview-grid' }, [
      div({ class: 'overview-chart' }, [
        h1([
          text('Profile Overview')
        ]),
        Chart.randomChart({
          range: state.overview.chartRange
        }),
        Menu({
          chartRange: state.overview.chartRange,
          menuOpen: state.overview.menuOpen,
          onToggleMenu: () => {
            dispatch(setMenuOpen, !state.overview.menuOpen)
          },
          onOpen: () => {
            dispatch(setMenuOpen, true)
          },
          onClose: () => {
            dispatch(setMenuOpen, false)
          },
          onSelect: chartRange => {
            dispatch(setChartRange, chartRange)
          }
        }),
        Menu({
          chartRange: state.overview.chartRange,
          menuOpen: state.overview.menuOpen,
          onToggleMenu: () => {
            dispatch(setMenuOpen, !state.overview.menuOpen)
          },
          onOpen: () => {
            dispatch(setMenuOpen, true)
          },
          onClose: () => {
            dispatch(setMenuOpen, false)
          },
          onSelect: chartRange => {
            dispatch(setChartRange, chartRange)
          }
        })
      ]),
      Card({
        head: 'Top Hashtag',
        content: '#dominatrix'
      }),
      Card({
        head: 'Engagement',
        content: '+14.5%'
      }),
      Card({
        head: 'Reach',
        content: '+134.1%'
      })
    ])
  ])
}

export default {
  view: Main(Overview),
  onroute: state => {}
}
