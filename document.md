## Document src

***

- 主な処理の流れ

    - 1: 画面左の要素挿入ボタンを押されると、画面右部分に押されたボタンに応じた要素(例 h1)が挿入される

    - 2: 挿入された要素をダブルクリックすると、文字列を編集できる

    - 3: 編集が完了し、要素外の部分がクリックされると文字列の編集が完了する

    - 4: 編集中文字列が空のまま、要素がクリックされると要素は消えてしまう

    - 5: また編集が終了した要素はドラッグによって、任意の箇所に移動できる

    - ?: ReactDnDの個人的な解釈

- 関数処理

    - ### 1: 要素の挿入 -> append関数

        - 要素挿入ボタンからタグ名を引数として受け取り、要素を挿入する

        - またreact-keyの生成と要素の並び替え時にと特定の照合のためのidを発行する

         ```js
                /*  idおよびkey、照合を行うため同一でなければならない  */
                let val = this.state.item.length + Math.random(10000)
         ```
        
        - ダブルクリックをすると、文字列を編集できる

         ```html
                /*  モックデータ  */
                <i className='item' id={val} key={val} onDoubleClick={e => this.insert(e)} />
         ```

         - なお、レイアウトの関係でdivタグに囲む場合とそうでない場合と別れる。

         - ReactではEventが通常のJSと異なるため、親が補足できない、そのためdivタグを使用している場合able関数を利用する
        
    - ### 2: 文字列の編集 -> insert関数,able関数

        - ダブルクリックされた要素のクラス名を受け取り、文字列を編集するためinput要素に変換する

        - id,keyは変更に対応するために元のモックデータのidをそのまま受け取りid,keyに割り当てる

         ```js
                key={l.key} id={e.target.id} // 同値
         ```

        - 変換する際にダブルクリックされ要素と、Reactオブジェクト内の要素を紹介する(もしかして必要ない???)

         ```js
                /*  l -> Reactオブジェクト : e.target -> ダブルクリックされたオブジェクト  */

                const target = this.state.item.map(l => {
                if (l.key === e.target.id) { // 紹介
                    const type = l.type
                    switch (type) { //　タグによる分岐
                        case 'h1':
                            return (<input className='convLarge' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />)
                        case 'h2':
                            return (<input className='convMedium' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />)
                        case 'h3':
                            return (<input className='convSmall' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />)
                        case 'p':
                            return (<input className='convText' size={30} placeholder={l.props.children} onBlur={e => this.blur(e)} key={l.key} id={e.target.id} />)
                        default:
                            return l
                        }
                    }
                    return l
                })
                this.setState({ item: target })
         ```

        - div要素で囲んである場合、ダブルクリックされた要素を補足できないためable関数内で適切に要素の補足を行う

         ```js
                /**
                 *  親が存在する場合には親をe.targetで補足できないため(仕様).able関数を利用して親を特定
                 *  elには要素の親となるDOMが代入されている
                 */
                const el = e.target.className.substr(0, 4) === 'Node' ? e.target : e.target.parentElement
         ```
          

         - 要素外をクリックするとinput内の文字列がそのまま元の要素のテキストとして変換される

         ```js
                onBlur={e => this.blur(e)}
         ```

    - ### 3: 編集されたテキストを受け取り、各要素として挿入 -> blur関数

        - 引き続きid,keyを前身となる要素から引き継ぐ    

        - 編集済みのinput要素を元の要素に変換、input要素からフォーカスが外れた時にイベントが発火する

        - 発火した際の要素のReactオブジェクトに対しての照会および、クラス名を元に各要素に変換を行う。

        - 変換した要素をドラッグで移動できるようにReactDnDを機能を実装したItemコンポーネントに入れる。

         ```js
                (<Item key={val} id={val} onDrop={(toId, fromId) => this.changes(toId, fromId)}>
                    <h2 id={val} key={val} className='item' onDoubleClick={e => this.edit(e)}>{e.target.value}</h2>
                </Item>)
         ```

         - ここでドラッグ要素としてオブジェクトを扱うため、オブジェクトの構造が入り子になる。

         - そのため補足対象となるオブジェクトが今までとは異なるため、able,insertを利用せずedit,ableEdit関数を利用する。

         - なおblur関数でも再度利用できるように,Itemコンポーネント及び入り子の要素に同値のid,keyを割り振っている。

    - ### 4: 要素の破棄

        - input要素の値を空にして、blur関数を発火させると要素はi(display: none)要素に変換され、最終的には破棄される

         ```js
                if (!e.target.value) return <i key={this.state.item.length + Math.random(10000)}></i>
         ```

    - 5: 要素のドラッグ、および再編集 -> blue関数

        - Itemコンポーネント内に入り子になっているため要素はドラッグが可能

        - そしてダブルクリックを行うことで、再編集できる。

         ```js
                onDoubleClick={e => this.ableEdit(e)}
         ```

    - ?: ReactDnDに対する個人的な解釈

    


        