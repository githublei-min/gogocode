const $ = require('../index');
const config = require('./config');
const jc1 = require('./code/simple1');
const jc2 = require('./code/simple2');
const jc5 = require('./code/simple5');
const jc6 = require('./code/simple6');
const tc1 = require('./code/simple-ts-1');
const hc1 = require('./code/simple1.html');
const hc2 = require('./code/simple2.html');
const jTryout = require('./code/simple-tryout');

const SIMPLE_CODE = `var a = 1;`;
const CODE = `
function test(c){
	let a = 1;
  	let b = 2;
  	return a + b + c;
}
test(11)`;
const OBJECT_CODE = `
const a = {
    name: 'jerry',
    age: 12
}`;
test('$.find: input is empty string should not throw error', () => {
    expect(()=>{
       const G = $(SIMPLE_CODE);
       G.find('');
    }).toThrow();
})

test('$.find: input is empty string should not throw error', () => {
    expect(()=>{
       const G = $(SIMPLE_CODE);
       const result = G.find('');
    }).toThrow();
})
test('$.find: input is simple selector should not throw error', () => {
    expect(()=>{
       const G = $(SIMPLE_CODE);
       G.find('var $_$ = $_$');
    }).not.toThrow();
})
test('$.find: input is simple selector result should be ok', () => {
    const G = $(SIMPLE_CODE);
    result = G.find('var $_$ = $_$').generate();
    expect(result).toBe('var a = 1;');
})
test('$.find: input is simple selector without $_$ should not throw error', () => {
    expect(()=>{
       const G = $(SIMPLE_CODE);
       G.find('var a = 1;');
    }).not.toThrow();
})
test('$.find: input is simple selector without $_$ result should be ok', () => {
    const G = $(SIMPLE_CODE);
    result = G.find('var a = 1;').generate();
    expect(result).toBe('var a = 1;');
})
test('$.find: input is string array should not throw error', () => {
    expect(()=>{
       const G = $(CODE);
       G.find(['let $_$ = $_$','test()']);
    }).not.toThrow();
})

test('$.find: input is string array result should be ok', () => {
    const G = $(CODE);
    const result = G.find(['let $_$ = $_$', 'test()']);
    const code0 = $(result.eq(0).node).generate();
    const code1 = $(result.eq(1).node).generate();
    const code2 = $(result.eq(2).node).generate();
    expect(code0 === 'let a = 1;' && code1 === 'let b = 2;' && code2 === 'test(11)').toBeTruthy();
})
test('$.find: result is return object', () => {
    expect(()=>{
       const G = $(CODE);
       G.find('return $_$');
    }).not.toThrow();
})
test('$.find: result is return object, result should be ok', () => {
    const G = $(CODE);
    const code = G.find('return $_$').generate();
    expect(code).toBe('return a + b + c;')
})
test('$.find: input is string array ,only one selector, should not throw error', () => {
    expect(()=>{
       const G = $(CODE);
       G.find(['var $_$ = $_$']);
    }).not.toThrow();
})
test('$.find: input is string array ,only one selector, result should be ok', () => {
    const G = $(CODE);
    const result = G.find(['let $_$ = $_$']).generate();
    expect(result).toBe('let a = 1;');
})
test('$.find: input is object  should not throw error', () => {
    expect(()=>{
       const G = $(jc1);
       G.find({type: 'StringLiteral', value: '$_$'});
    }).not.toThrow();
})
test('$.find: input is object result should be ok', () => {
    const G = $(jc1);
    const code = G.find({ type: 'StringLiteral', value: '$_$' }).generate();
    expect(code).toBe("'../index'");
})
test('$.find: input is object array  should not throw error', () => {
    expect(()=>{
       const G = $(CODE);
       G.find([{type: 'StringLiteral', value: '$_$'}, {type: 'Identifier', name: '$_$'}]);
    }).not.toThrow();
})
test('$.find: find properties key should not throw error', () => {
    expect(()=>{
       const G = $(OBJECT_CODE);
       G.find(`$_$:'jerry'`);
    }).not.toThrow();
})
test('$.find: find properties key result should be ok', () => {
    const G = $(OBJECT_CODE);
    // todo support key: value
    const code = G.find(`{ $_$ : 'jerry' }`).generate();
    expect(code.indexOf(`name`) > -1).toBeTruthy();
})
test('$.find: find object ', () => {
    expect(()=>{
       const G = $(OBJECT_CODE);
       G.find(`{$_$:'jerry'}`);
    }).not.toThrow();
})
test('$.find: find object result should be ok', () => {
    const G = $(OBJECT_CODE);
    const code = G.find(`{$_$:'jerry'}`).generate();
    expect(code.indexOf(`name: 'jerry',`) > -1).toBeTruthy();
})
test('$.find: find object result should be ok', () => {
    const G = $(OBJECT_CODE);
    const code = G.find(`{name:'jerry'}`).generate();
    expect(code.indexOf(`name: 'jerry',`) > -1).toBeTruthy();
})
test('$.find: find properties value should not throw error', () => {
    expect(()=>{
       const G = $(OBJECT_CODE);
       G.find(`name:$_$`);
    }).not.toThrow();
})
test('$.find: find properties value result should be ok', () => {
    const G = $(OBJECT_CODE);
    const code = G.find(`{ name: $_$ }`).generate();
    expect(code.indexOf(`jerry`) > -1).toBeTruthy();
})
test('$.find: simple tryout js code if condition result should be ok', () => {
 
    const code = $(jTryout).find('if ($_$){}')
        .each(ast => {
            ast.replace(`!Tryout.TRYOUT_SID_391`,`false`)
            .replace(`Tryout.TRYOUT_SID_391`,'true')
        })
        .root()
        .generate();
    const result = code.indexOf(`if (!Tryout.TRYOUT_SID_391`) < 0 && code.indexOf(`if (Tryout.TRYOUT_SID_391`) < 0
    expect(result).toBeTruthy();
})
test('$.find: simple js code if condition result should be ok', () => {
    const match = $(`if (a && 1 || 0) { b } else { c; dosth() }`)
    .find(`if ($_$1) { $_$2 } else { $_$3 }`)
    .match;
    const result = match['1'][0].value === 'a && 1 || 0' && 
    match['2'][0].value === 'b' &&
    match['3'][0].value === 'c'
    expect(result).toBeTruthy();
})
test('$.find: replace function name', () => {

    const G = $(`const code = Page({
        onShow() { },
        data: { }
      })`);
    const code = G.find(`Page({ $_$() { }  })`)
        .each(item => {
            if (item.match[0][0].value == 'onShow') {
                item.match[0][0].node.name = 'render'
            }
        }).generate();
    const result = code.indexOf(`render()`) > -1 && code.indexOf(`onShow()`) < 0;
    expect(result).toBeTruthy();
})
test('$.find: find function name', () => {
    expect(()=>{
       const G = $(CODE);
       G.find(`function $_$(c)`);
    }).not.toThrow();
})
test('$.find: find function name result should be ok', () => {
    const G = $(CODE);
    //待定
    const code = G.find(`function $_$(c) { $_$2 }`).match[0][0].value;
    expect(code).toBe('test');
})
test('$.find: find arrow function name', () => {
    const G = $(jc1);
    const code = G.find(`()=>{}`).generate();
    expect(code.indexOf(`console.log('this is arrow function' )`) > -1).toBeTruthy();
})
test('$.find: find object', () => {
    expect(()=>{
       const G = $(OBJECT_CODE);
       G.find(`const a = $_$`);
    }).not.toThrow();
})
test('$.find: find object result should be ok', () => {
    const G = $(OBJECT_CODE);
    const code = G.find(`const a = $_$`).generate();
    expect(code.indexOf(`name: 'jerry',`) > -1).toBeTruthy();
})
test('$.find: find argument', () => {
    expect(()=>{
       const G = $(CODE);
       G.find(`test($_$)`);
    }).not.toThrow();
})
test('$.find: find argument result should be ok', () => {
    const G = $(CODE);
    const code = G.find(`test($_$)`).generate();
    expect(code).toBe('test(11)');
})
test('$.find: find argument and body', () => {
    expect(()=>{
       const G = $(CODE);
       G.find(`function test($_$){$_$}`);
    }).not.toThrow();
})
test('$.find: find argument and body should be ok', () => {
    const G = $(CODE);
    const code = G.find(`function test($_$){$_$}`).generate();
    expect(code.indexOf('function test(c){') > -1 &&
        code.indexOf('let a = 1;') > -1
    ).toBeTruthy()
})
test('$.find: find in function should be ok', () => {
    const G = $(CODE);
    const code = G.find(`function $_$() {
        let a = 1;
      }`).generate();
    expect(code.indexOf('function test(c){') > -1 &&
        code.indexOf('let a = 1;') > -1
    ).toBeTruthy()
})
test('$.find: find in function should be ok', () => {
    let has = false;
    const G = $(CODE);
    G.find(`function $_$() {  }`)
    .each(item => {
        if(item.has('let a = 1;')){
            has = true;
        }
    })
    expect(has).toBeTruthy();
})
test('$.find: find function should be ok', () => {
    let has = false;
    const G = $(CODE);
    G.find(`$_$()`)
        .each(item => {
            has = true;
        })
    expect(has).toBeTruthy();
})
test('$.find: find function should be ok', () => {
    let has = false;
    const G = $(jc1);
    G.find(`parent().$_$()`)
        .each(item => {
            has = true;
        })
    expect(has).toBeTruthy();
})
test('$.find: find function should be ok', () => {
    let has = false;
    const G = $(CODE);
    G.find(`test()`)
        .each(item => {
           has = true;
        })
    expect(has).toBeTruthy();
})
test('$.find: find "for" code should be ok', () => {
    const G = $(jc2);
    const code = G.find(`for($_$1;$_$2;$_$3){$_$4}`).generate();
    expect(code.indexOf('for (let i = 0; i < array.length; i++) {') > -1 &&
        code.indexOf('const element = array[i];') > -1
    ).toBeTruthy()
})
test('$.find: find "for" code should be ok', () => {
    const G = $(jc2);
    const match = G.find(`for($_$1;$_$2;$_$3){$_$2}`).match;
    expect(match['1'].length === 1 && match['2'].length === 2 && match['3'].length === 1).toBeTruthy();
})
// test('$.find: find in "switch" code should be ok', () => {
//     const G = $(jc2);
//     const code = G.find(`switch ($_$) {$_$}`).generate();
//     expect(code.indexOf('switch (a)') > -1 &&
//         code.indexOf(' case 1:') > -1
//     ).toBeTruthy()
// })
// TODO
test('$.find: find in "catch" code should be ok', () => {
    const G = $(jc2);
    const code = G.find(`try {$_$} catch (e) {$_$}`).generate();
    expect(code.indexOf('try') > -1 &&
        code.indexOf(' catch') > -1
    ).toBeTruthy()
})
// test('$.find: find in "catch" code should be ok', () => {
//     //  如何处理非完整try catch 语句？？
//     const G = $(jc2);
//     const code = G.find(`try {$_$} `).generate();
//     expect(code.indexOf('try') > -1 
//     ).toBeTruthy()
// })
// TODO

// test('$.find: find in "catch" code should be ok', () => {
//      //  如何处理非完整try catch 语句？？
//     const G = $(jc2);
//     const code = G.find(`catch (e) {$_$}`).generate();
//     expect(code.indexOf('try') > -1 
//     ).toBeTruthy()
// })
test('$.find: find super in ts',()=>{
    const nodes = [];
    const code = $(tc1)
        .find(`super($_$,$_$,$_$)`, { ignoreSequence: true })
        .each(item => {
            item.after('console.log("super")')
        }).root().generate();
    $(code).find(`console.log("super")`).each(item => {
        nodes.push(item);
    })
    const result = nodes.length === 1 &&
    nodes[0].siblings().generate().indexOf(`super(options.baseWidth, options.baseHeight, options);`) > -1;
    expect(result).toBeTruthy();
 })
test('$.find: find constructor in ts', () => {
    const nodes = [];
    const code = $(tc1)
        .find(`constructor($_$){}`)
        .append('body', 'console.log("constructor")')
        .root()
        .generate();
    $(code).find(`console.log("constructor")`).each(item => {
        nodes.push(item);
    })
    const result = nodes.length === 1
    expect(result).toBeTruthy();
})
test('$.find: find all',()=>{
   const nodes = [];
    $(jc1)
        .find('$_$')
        .each(item => {
            nodes.push(item);
        })
  expect(nodes.length > 0).toBeTruthy();
})
test('$.find: find h',()=>{
    const nodes = [];
     $(jc1)
         .find('h')
         .each(item => {
             nodes.push(item);
         })
   expect(nodes.length > 0).toBeTruthy();
 })
test('$.find: 获取表达式中的变量', () => {
    const members = [];
    $(`(a.b.c && b) || (c && d)`)
        .find('$_$')
        .each(item => {
            if (item.parent().node.type == 'MemberExpression' && item.parent(1).node.type != 'MemberExpression') {
                // 输出a.b.c整体 而不是a \ b \ c
                members.push(item.parent().generate())
            } else if (item.parent().node.type != 'MemberExpression') {
                // 输出独立的变量
                members.push(item.generate())
            }
        })
    expect(members[0] === 'a.b.c' &&
        members[1] === 'b' &&
        members[2] === 'c' &&
        members[3] === 'd'
    ).toBeTruthy();
})
test('$.find: find string', () => {
    const nodes = [];
    $(jc1)
        .find(`'$_$'`)
        .each(item => {
            nodes.push(item);
        })
  expect(nodes[0].generate() === `'../index'`).toBeTruthy();
})
test('$.find: find string', () => {
    const nodes = [];
    $(jc1)
        .find(`'this is string'`)
        .each(item => {
            nodes.push(item);
        })
  expect(nodes[0].generate() === `'this is string'`).toBeTruthy();
})
test('$.find: find 获取赋值语句', () => {
    const matchList = [];
    $(jc1)
        .find(`$_$1 = $_$2`)
        .each(item => {
            matchList.push(item.match[1]);
        })
  expect(matchList[0][0].value === `a`).toBeTruthy();
})

test('$.find: find 获取赋值语句', () => {
    const matchList = [];
    $(jc1)
    .find('a = $_$')
    .each(item => {
        matchList.push(item.match[0])
     })
  expect(matchList[0][0].value).toBe(3);
})
test('$.find: find 获取赋值语句', () => {
    const matchList = [];
    $(jc1)
    .find('car.color = $_$')
    .each(item => {
        matchList.push(item.match[0])
     })
  expect(matchList[0][0].value).toBe('green');
})
test('$.find: find 获取赋值语句', () => {
    const matchList = [];
    $(jc1)
    .find('$_$1.color = $_$2')
    .each(item => {
        matchList.push(item.match['1'])
     })
  expect(matchList[0][0].value).toBe('car');
})
test('$.find: find 获取赋值语句 arr', () => {
    const matchList = [];
    $(jc1)
    .find('$_$ = [1, 2]')
    .each(item => {
        matchList.push(item.match[0])
     })
  expect(matchList[0][0].value).toBe('arr');
})
test('$.find: 在某作用域里面获取变量定义', () => {
    const matchList = [];
    const code = $(jc1)
    .find(`const obj = { name: 'test' };`)
    .parent().generate();
const compareCode = $(
`{
    function test(){
        let a = 1;
    }
    const obj = { name: 'test' };
}`).generate();
  expect(code).toBe(compareCode);
})
test('$.find: class define use $_$', () => {
    const code = $(jc5)
    .find('class $_$ {}').generate();
    const result = code.indexOf('class Car {') > -1;
    expect(result).toBeTruthy();
})
test('$.find: class define', () => {
    const code = $(jc5)
    .find('class Car {}').generate();
    const result = code.indexOf('class Car {') > -1;
    expect(result).toBeTruthy();
})
test('$.find: class define', () => {
    const match = $(jc5)
        .find(`class Car {
        color = $_$c;
        size = $_$s;
      }`).match;
    const result = match['c'][0].value === 'red' && match['s'][0].value === 12;
    expect(result).toBeTruthy();
})
test('$.find: ts type define', () => {
    let find = false;
    $(jc6)
        .find('CheckBoxProps')		// 找到的有可能是变量名，也有可能是类型定义
        .each(item => {
            if (item.parent().node.type == 'TSTypeReference') {
                find = true;
            }
        })
    expect(find).toBeTruthy();
})
test('$.find: ts type define', () => {
    const match = $(jc6)
        .find('let $_$1:CheckBoxProps = $_$2')		
        .match;
    const result = match['1'][0].value === 'cbp' && match['2'][0].value === '{\n  checked: true,\n  width: 100\n}';
    expect(result).toBeTruthy();
})
test('$.find: ts type define in function', () => {
    const match = $(jc6)
        .find('($_$: CheckBoxProps) => {}')		
        .match;
    const result = match[0][0].value === 'props' ;
    expect(result).toBeTruthy();
})
test('$.find: find import ', () => {
    const match = $(jc2)
        .find(`import $_$1 from '$_$2'`)		
        .match;
    const result = match['1'][0].value === 'moment' ;
    expect(result).toBeTruthy();
})
test('$.find: find import ', () => {
    const match = $(jc1)
        .find(`export $_$ from '@path/sth'`)		
        .match;
    const result = match[0][0].value === 'sth' ;
    expect(result).toBeTruthy();
})

test('$.find: render property', () => {
    const match = $(`const a = {
        render: function() {}
      }`)
        .find('render: function() {}')		
    const result = !!match[0];
    expect(result).toBeTruthy();
})

test('$.find: find 模拟解构赋值 ', () => {
    // 找到const {a,b = {b1},c = 3} = d; 转为const a = d.a, b = d.b || {b1}, c = d.c || 3;

    const code = $(`const {a,b = {b1},c = 3} = d`)
        .find('const { $_$1 = $_$2 } = $_$3')
        .each(item => {
            const keyList = item.match[1].filter((item, i) => i % 2 == 0)
            const obj = item.match[3][0].value
            const newkeyList = keyList.map((key, i) => {
                let dec = `${key.value} = ${obj}.${key.value}`
                if (item.match[2][i].value != key.value) {
                    dec += ('||' + item.match[2][i].value)
                }
                return dec
            })
            item.replaceBy(`const ${newkeyList.join(', ')}`)
        })
        .root()
        .generate()
    const result = code.indexOf('const a = d.a, b = d.b||{b1}, c = d.c||3') > -1;
    expect(result).toBeTruthy();
})
test('$.find: simple1 html code', () => {
    expect(() => {
        const G = $(hc1, config.html).find('<span>$_$</span>');
    }).not.toThrow();
})
test('$.find: simple1 html code input is object result should be ok', () => {
    const G = $(hc1, config.html);
    // 选择器构造 抛出异常报错
    const code = G.find({ nodeType: 'text', content: G.expando }).generate();
    //待定
    expect(code).toBe("\n");
})

test('$.find: simple1 html code input is object result should be ok', () => {
    const G = $(hc1, config.html);
    // 选择器构造 抛出异常报错
    const code = G.find({ nodeType: 'tag', content: G.expando }).generate();
    //待定
    expect(code.indexOf('<html>') > -1).toBeTruthy();
})

test('$.find: simple1 html code result should be ok', () => {
    const G = $(hc1, config.html).find('<span>');
    const code = G.generate();
    expect(code).toBe('<span>test</span>')
})
test('$.find: simple1 html code use $_$ result should be ok', () => {
    const G = $(hc1, config.html).find('<span>$_$</span>');
    const code = G.generate();
    expect(code).toBe('<span>test</span>')
})
test('$.find: simple1 html code use full tag result should be ok', () => {
    const G = $(hc1, config.html).find('<span>test</span>');
    const code = G.generate();
    expect(code).toBe('<span>test</span>')
})
test('$.find: simple1 html code find attr value', () => {
    const G = $(hc1, config.html).find('<div id=$_$>');
    const match = G.match;
    expect(match[0][0].value).toBe('1');
})
test('$.find: simple1 html code find attr key', () => {
    const G = $(hc1, config.html).find('<div $_$="1">');
    const match = G.match;
    expect(match[0][0].value).toBe('id');
})
test('$.find: simple1 html code find DOCTYPE ', () => {
    const G = $(hc1, config.html).find('<!DOCTYPE html>');
    const match = G.match;
    // 无$_$ 无match返回也合理
    // expect(match[0].value).toBe('');
})
test('$.find: script code result should be ok', () => {
    const G = $(hc1, config.html);
    const result = G.find('<script>$_$</script>');
    const match = result.match;
    expect(match).toBe(` var a = '1';`);
})
test('$.find: style code result should be ok', () => {
    const G = $(hc1, config.html);
    const result = G.find('<style>$_$</style>');
    const match = result.match;
    expect(match.indexOf('color: #000;') > -1).toBeTruthy();
})
test('$.find: comment code result should be ok', () => {
    const G = $(hc1, config.html);
    const result = G.find('<!-- $_$ -->');
    const match = result.match;
    expect(match).toBe(` comment test `);
})
test('$.find: replace html tag result should be ok', () => {

    const G = $(hc1, config.html);
    
    const code = G.find('<form $_$>$_$</form>').each((ast)=>{
        ast.node.content.name = 'mx-form'
    }).root().generate();
    
    expect(code.indexOf('<form') < 0 && code.indexOf('<mx-form') > -1).toBeTruthy();

})

test('$.find: find script tag content', () => {
    const G = $(hc2, config.html);
    let appScriptCount = 0;
    const AST = G.find('<script>$_$</script>').each(function (ast) {
        //找到两个script标签有内容，实际上应该只有一个
        if (ast.match) {
            appScriptCount++;
        }
    });
    expect(appScriptCount).toBe(1);
})

test('$.find: find objproperty', () => {
    const AST = $(
        `
        import Vue from 'vue';
        export default {
            name: 'cd',
            props: {
              msg: String,
            },
            directives: {
              highlight: {
                bind(el, binding, vnode) {
                  el.style.background = binding.value;
                },
                inserted(el, binding) {
                  el.parentNode.style.border = \`1px solid \${binding.value}\`;
                }
              },
            },
          };`
    ).find(`
    directives: {
      $_$1: {
        bind($_$2, $_$3, $_$4) {
          $$$1
        },
      },
    }
    `)
    expect(AST).toBeTruthy();
})

test('$.find: find comments 1', () => {
    const res = $(`// c3
    aaaa
    // c1
    var a = 1;
    // c2
    function x () {
        // c3
        // c3
        i++
        // c3
        // c4
        /* sdsd

        sdads
        */
       // c3
    }
    // c3`)
    .find('// $_$')
    .each(item => {
        item.value.value += '>>>>>'
    })
    .root()
    .generate()
    expect(res.match('>>>>')).toBeTruthy();
})

test('$.find: find comments 1', () => {
    const res = $(`
    // c1
    var a = 1;
    // c2
    function x () {
        i++
        // c3
        /* sdsd

        sdads
        */
    }`)
    .find('/* $_$ */')
    .each(item => {
        item.value.value += '>>>>>'
    })
    .find('// $_$')
    .each(item => {
        item.value.value += '<<<<<'
    })
    .root()
    .generate()
    expect(res.match('>>>>')).toBeTruthy();
})

test('$.find: html close tag', () => {
    const G = $(`<hhh>222
        <hhh>111</hhh>
        <hhh/>
        <hhh/>
        <hhh>333</hhh>
    </hhh>`, config.html);
    const result = G.find(['<hhh></hhh>', '<hhh/>']);
    expect(result.length == 5).toBeTruthy();
})