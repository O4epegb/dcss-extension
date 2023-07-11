import { browser } from 'webextension-polyfill-ts'

if (document.readyState === 'interactive') {
  main()
} else {
  document.addEventListener('DOMContentLoaded', () => {
    main()
  })
}

function main() {
  const observer = new MutationObserver((mutationsList) => {
    if (document.title !== 'WebTiles - Dungeon Crawl Stone Soup') {
      return
    }

    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          if (!('tagName' in node)) {
            continue
          }

          const el = node as HTMLElement

          if (el.id === 'player_list') {
            let headTh = document.querySelector<HTMLTableCellElement>('.dcss-ext-th')

            if (!headTh) {
              const tableHeadRow = document.querySelector('#player_list thead tr')
              headTh = document.createElement('th')
              headTh.classList.add('dcss-ext-th')
              headTh.innerHTML = 'Stats WR%/G/W'
              headTh.style.whiteSpace = 'nowrap'

              insertAfter(headTh, tableHeadRow.querySelector('th.username'))
            }

            ;[...el.querySelectorAll('td.username')].map((td) => {
              const tr = td.parentElement
              let infoTd = tr.querySelector('.dcss-ext-info')
              let contentSpan = tr.querySelector('.dcss-ext-info span')
              const name = td.querySelector('a').textContent

              if (!infoTd) {
                infoTd = document.createElement('td')
                infoTd.classList.add('dcss-ext-info')
                insertAfter(infoTd, tr.querySelector('td'))

                contentSpan = document.createElement('span')
                infoTd.prepend(contentSpan)

                const link = document.createElement('a')
                link.textContent = '↗'
                link.href = `https://dcss-stats.vercel.app/players/${name}`
                link.target = '_blank'
                link.style.textDecoration = 'none'
                link.style.display = 'inline-block'
                link.style.padding = '0 4px'
                infoTd.prepend(link)
              }

              browser.runtime.sendMessage({ name }).then((response) => {
                const { wins, games } = response
                if (contentSpan) {
                  contentSpan.textContent = `${formatPercent(
                    (games ? wins / games : 0) * 100,
                  )}% ${games}/${wins}`
                }
              })
              // .catch((error) => {
              //   // TODO log somewhere?
              //   // console.error(error);
              // })

              return td.querySelector('a').textContent
            })
          }
        }
      }
    }
  })

  observer.observe(document.body, {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
  })
}

function formatPercent(num: number) {
  return num.toFixed(2).padStart(6, ' ')
}

function insertAfter(newNode: Element, referenceNode: Element) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}
