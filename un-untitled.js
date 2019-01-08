var window_title, title_end, un_observer, tab, editorView, editor, editors = []
var styler = document.createElement('style')
styler.setAttribute('id', 'styler')
styler.innerHTML = `
  .new_title {padding:0;text-align:center;margin:0 0.66em;
  overflow:hidden;white-space:pre;text-overflow:ellipsis;}`
document.head.appendChild(styler)
module.exports = {
  activate() {
    window_title = document.head.getElementsByTagName('title')[0]
    function callback(mutationsList, un_observer) {
      for (var mutation of mutationsList) {currently()}
    }
    un_observer = new MutationObserver(callback)
    un_observer.observe(window_title, {childList: true})
    editor = atom.workspace.getActiveTextEditor()
    var parent = atom.views.getView(editor).parentElement.parentElement
    var return_to = parent.getElementsByClassName('tab-bar')[0].getElementsByClassName('active')[0]
    for (tab of document.getElementsByClassName('modified')) {
    	if (tab.getElementsByClassName('title')[0].innerHTML == 'untitled') {
    		tab.click()
        editor = atom.workspace.getActiveTextEditor()
        add_new_title()
    	}
    }
    return_to.click()

    currently()
  },
  deactivate() {
    un_observer.disconnect()
  }
}
function currently() {
  for (var e of editors) {
    e.removeEventListener('keyup', add_new_title)
    document.getElementsByClassName('new_path')[0].remove()
  }
  editors = []
  editor = atom.workspace.getActiveTextEditor()
  try {var file = editor.getPath()}
  catch(e) {var file = ''}
  if (file === undefined) {
    editorView = atom.views.getView(editor)
    var parent = editorView.parentElement.parentElement
    tab = parent.getElementsByClassName('active')[0]
    add_new_title()
    if (editors.indexOf(editorView) < 0) {
      editors.push(editorView)
      editorView.addEventListener('keyup', add_new_title)
    }
  }
}
function add_new_title() {
  var active = editor.getText().substr(0,30)
  if (active == '') {active = 'untitled'}
  if (!tab.getElementsByClassName('new_title').length) {
    var new_title = document.createElement('div')
    new_title.setAttribute('class', 'new_title')
    tab.prepend(new_title)
  }
  tab.getElementsByClassName('new_title')[0].innerHTML = active
  var dash = window_title.innerHTML.indexOf('—')
  title_end = window_title.innerHTML.substr(dash)
  un_observer.disconnect()
  window_title.innerHTML = active + ' ' + title_end
  un_observer.observe(window_title, {childList: true})
  var status_bar = document.getElementsByTagName('status-bar-file')[0]
  if (!status_bar.getElementsByClassName('new_path').length) {
    var new_path = document.createElement('div')
    new_path.setAttribute('class', 'new_path')
    status_bar.prepend(new_path)
  }
  status_bar.getElementsByClassName('new_path')[0].innerHTML = active
}
