import React, { Component } from 'react'
import { DragDropContext, DropTarget, DragSource } from 'react-dnd'
import ReactDnDHTML5Backend from 'react-dnd-html5-backend'
import request from 'superagent'

@DragDropContext(ReactDnDHTML5Backend)

/**
 *  まずアンケートレイアウトを作成する、操作性を高めシンプルなUIにする
 *  そして完成したデータを次のコンポーネントに渡す
 */
export default class MainAppFirst extends Component {
    constructor(props) {
        super(props)
        /*  プレビュー画面内要素配列  */
        this.state = { item: [], title: [] }
    }
    able(e) {
        /**
         *  親が存在する場合には親をe.targetで補足できないため(仕様).able関数を利用して親を特定
         *  elには要素の親となるDOMが代入されている
         */
        const el = e.target.className.substr(0, 4) === 'Node' ? e.target : e.target.parentElement
        const target = this.state.item.map(l => {
            if (l.key === el.id) {
                switch (l.props.children[0].props.type) {
                    case 'radio':
                        return <input className='convRadio' size={30} placeholder='項目の値を入力してください(単一)' onBlur={e => this.blur(e)} key={l.key} id={el.id} />
                    case 'checkbox':
                        return <input className='convCheckbox' size={30} placeholder='項目の値を入力してください(複数)' onBlur={e => this.blur(e)} key={l.key} id={el.id} />
                    default:
                        return false
                }
            }
            return l
        })
        this.setState({ item: target })
    }
    append(e) {
        /*  keyとなる乱数  */
        let val
        /*  要素追加ボタンに合わせてプレビューに要素を追加  */
        switch (e) {
            case 'h1':
                /*  keyが被らないように乱数を生成  */
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(
                    /** 
                     *  ダブルクリックされた要素をitem配列内から検索、そのためのkeyにidを利用
                     *  keyはReactレンダリング側でしか閲覧できないのでkeyと同一の値をidに充てる
                     */
                    <h1 className='item' id={val} key={val} onDoubleClick={e => this.insert(e)}>
                        表題などに利用されるタイトル大です
                    </h1>
                )
                /*  配列に追加しただけではレンダリングされないので、再描画  */
                this.setState({})
                break
            case 'h2':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(<h2 className='item' id={val} key={val} onDoubleClick={e => this.insert(e)}>見出しなどに利用されるタイトル中です</h2>)
                this.setState({})
                break
            case 'h3':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(<h3 className='item' id={val} key={val} onDoubleClick={e => this.insert(e)}>小見出しなどに利用されるタイトル小です</h3>)
                this.setState({})
                break
            /*  バグの元  */
            case 'input':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(<input className='item' id={val} key={val} placeholder='入力欄一行です' />)
                this.setState({})
                break
            case 'textarea':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(<textarea className='item' id={val} key={val} rows='6' cols='30' placeholder='入力欄複数行です' />)
                this.setState({})
                break
            case 'radio':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(
                    /**
                     *  Radioなどの要素は文字列とセットなので親divに包んで配列に追加
                     *  親を識別するためにclassの先頭にNodeを挿入する
                     *  Radioではnameを同一にする、複数のRadioが出てきたらその都度考える
                     */
                    <div className='Node tstRadio' id={val} key={val} onDoubleClick={e => this.able(e)}>
                        <input type='radio' name='radio' value='選択肢' />
                        <span>単一選択肢です</span>
                    </div>
                )
                this.setState({})
                break
            case 'box':
                val = this.state.item.length + Math.random(10000)
                this.state.item.push(
                    <div className='Node tstBox' id={val} key={val} onDoubleClick={e => this.able(e)}>
                        <input type='checkbox' name='checkbox' value='複数' />
                        <span>複数選択肢です</span>
                    </div>
                )
                this.setState({})
                break
            case 'p':
                val = this.state.item.length + Math.random(10000)
                const Drag = this.state.Drag
                this.state.item.push(<p className='item' id={val} key={val} onDoubleClick={e => this.insert(e)}>本文に利用される文字列です</p>)
                this.setState({})
                break
            default:
                return false
        }
    }
    blur(e) {
        /**
         *  編集済みのinput要素を元の要素に変換、input要素からフォーカスが外れた時にイベントが発火する
         *  key,idは要素を発行した時のものを継承、主に前身のinput要素の値を受け継ぐことが目的
         */
        const target = this.state.item.map(l => {
            if (l.key === e.target.id) {
                const val = e.target.id
                switch (e.target.className) {
                    case 'convLarge':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <h1 id={val} key={val} className='item' onDoubleClick={e => this.edit(e)}>{e.target.value}</h1>
                            </Item>
                        )
                    case 'convMedium':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <h2 id={val} key={val} className='item' onDoubleClick={e => this.edit(e)}>{e.target.value}</h2>
                            </Item>
                        )
                    case 'convSmall':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <h3 id={val} key={val} className='item' onDoubleClick={e => this.edit(e)}>{e.target.value}</h3>
                            </Item>
                        )
                    case 'convRadio':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <div className='Node tstRadio' id={val} key={val} value={e.target.value} onDoubleClick={e => this.ableEdit(e)}>
                                    <input type='radio' name='radio' value='選択肢' />
                                    <span>{e.target.value}</span>
                                </div>
                            </Item>
                        )
                    case 'convCheckbox':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <div className='Node tstBox' id={val} key={val} value={e.target.value} onDoubleClick={e => this.ableEdit(e)}>
                                    <input type='checkbox' name='checkbox' value='複数' />
                                    <span>{e.target.value}</span>
                                </div>
                            </Item>
                        )
                    case 'convText':
                        if (!e.target.value) return (
                            <moc key={this.state.item.length + Math.random(10000)}>
                                <moc key={this.state.item.length + Math.random(10000)}></moc>
                            </moc>
                        )
                        return (
                            <Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                                <p id={val} key={val} className='item' onDoubleClick={e => this.ableEdit(e)}>{e.target.value}</p>
                            </Item>
                        )
                    default:
                        return false
                }
            }
            return l
        })
        this.setState({ item: target })
    }
    changes(toId, fromId) {
        const it = this.state.item.slice()
        const toIndex = it.findIndex(i => i.props.id === toId)
        const fromIndex = it.findIndex(i => i.props.id === fromId)
        const toItem = it[toIndex]
        const fromItem = it[fromIndex]
        it[toIndex] = fromItem
        it[fromIndex] = toItem
        this.setState({ item: it })
    }
    edit(e) {
        const target = this.state.item.map(l => {
            if (l.props.children.key === e.target.id) {
                const type = l.props.children.type
                switch (type) {
                    case 'h1':
                        return <input className='convLarge' size={30} placeholder={l.props.children.props.children} onBlur={e => this.blur(e)} key={e.target.id} id={e.target.id} />
                    case 'h2':
                        return <input className='convMedium' size={30} placeholder={l.props.children.props.children} onBlur={e => this.blur(e)} key={e.target.id} id={e.target.id} />
                    case 'h3':
                        return <input className='convSmall' size={30} placeholder={l.props.children.props.children} onBlur={e => this.blur(e)} key={e.target.id} id={e.target.id} />
                    case 'p':
                        return <input className='convText' size={30} placeholder={l.props.children.props.children} onBlur={e => this.blur(e)} key={e.target.id} id={e.target.id} />
                    default:
                        return l
                }
            }
            return l
        })
        this.setState({ item: target })
    }
    ableEdit(e) {
        const el = e.target.className.substr(0, 4) === 'Node' ? e.target : e.target.parentElement

        const target = this.state.item.map(l => {
            if (l.key === el.id) {
                switch (l.props.children.props.children[0].props.type) {
                    case 'radio':
                        return <input className='convRadio' size={30} placeholder={l.props.children.props.value} onBlur={e => this.blur(e)} key={l.key} id={el.id} />
                    case 'checkbox':
                        return <input className='convCheckbox' size={30} placeholder={l.props.children.props.value} onBlur={e => this.blur(e)} key={l.key} id={el.id} />
                    default:
                        return false
                }
            }
            return l
        })
        this.setState({ item: target })
    }
    insert(e) {
        /** 
         *  ダブルクリックされた時点でinput要素 + 各要素フォントサイズに変換 
         *  値が変更された時点で値を各要素に変換、その時にダブルクリックされた時点での配列位置を記憶しておかなければならない
        */
        const target = this.state.item.map(l => {
            if (l.key === e.target.id) {
                const type = l.type
                switch (type) {
                    case 'h1':
                        return <input className='convLarge' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />
                    case 'h2':
                        return <input className='convMedium' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />
                    case 'h3':
                        return <input className='convSmall' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />
                    case 'p':
                        return <input className='convText' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />
                    default:
                        return l
                }
            }
            return l
        })
        this.setState({ item: target })
    }
    submit(e) {
        let details = new String()
        for (let i = 0, j = this.state.item; i < j.length; i++) {
            const l = j[i]
            if (typeof l.type === 'function') {
                if (l.props.children.props.className.substr(0, 4) === 'Node') {
                    details += `<div>`
                        + `<input type="${l.props.children.props.children[0].props.type}" />`
                        + `<span>${l.props.children.props.children[1].props.children}</span>`
                        + `</div>`;
                }
                else details += `<${l.props.children.type}>${l.props.children.props.children}</${l.props.children.type}>`
            }
        }
        request
            .get('/api/insert')
            .query({
                title: '店内アンケート',
                str: details
            })
            .end((err, data) => {
                if (err) return
                console.log(details)
            })
    }
    render() {
        return (
            <div>
                <div className="container">
                    <div className="content_header">
                        <h3>レイアウトを選択してください</h3>
                        <button className='submit_btn' onClick={e => this.submit(e)}>詳細設計画面</button>
                    </div>
                    <div className="main_content">
                        <div className="editer">
                            <div className="grid_content" onClick={e => this.append('h1')}>タイトル 大</div>
                            <div className="grid_content" onClick={e => this.append('h2')}>タイトル 中</div>
                            <div className="grid_content" onClick={e => this.append('h3')}>タイトル 小</div>
                            {
                                /**
                                 * <div className="grid_content" onClick={e => this.append('input')}>入力欄 一行</div>
                                 * <div className="grid_content" onClick={e => this.append('textarea')}>入力欄 複数行</div>
                                 */
                            }
                            <div className="grid_content" onClick={e => this.append('radio')}>選択肢 単一</div>
                            <div className="grid_content" onClick={e => this.append('box')}>選択肢 複数</div>
                            <div className="grid_content" onClick={e => this.append('p')}>文章</div>
                            <div className="grid_content" onClick={e => this.append('tamplate')}>基本テンプレート</div>
                        </div>
                        <div className="preview">
                            <div className="variable">{this.state.item}</div>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className='result'>{this.state.result}</div>
                </div>
            </div>
        )
    }
}

@DropTarget("i", {
    drop(dropProps, monitor, dropComponent) {
        const dragProps = monitor.getItem()
        if (dropProps.id !== dragProps.id) {
            dragProps.onDrop(dragProps.id, dropProps.id)
        }
    }
}, connect => {
    return {
        connectDropTarget: connect.dropTarget()
    }
})
@DragSource("i", {
    beginDrag(props) {
        return props;
    }
}, (connect, monitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
})

class Item extends React.Component {
    render() {
        return this.props.connectDragSource(
            this.props.connectDropTarget(this.props.children)
        )
    }
}