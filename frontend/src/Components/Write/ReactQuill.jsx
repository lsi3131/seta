import React, {
    ReactChild,
    ReactFragment,
    RefObject,
    useMemo,
    useState,
} from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const formats = [
    'font',
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'align',
    'color',
    'background',
    'size',
    'h1',
    'image',
];


export const CustomReactQuill = () => {
    
    const [values, setValues] = useState();
    
    const modules = useMemo(() => {
        return {
            toolbar: {
                container: 
                [   
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ align: [] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{color: [],},{ background: [] },],
                    ['image'],
                ],
            },

            handlers: {
                image: () => {
                    const input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    input.setAttribute('multiple', '');

                    input.addEventListener('change', () => {
                    if (input.files) {
                        handleMultipleImagesUpload(input.files);
                    }
                    });

                    input.click();
                },
            },
        };
    }, []);

    

    return(
        <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={setValues}
            placeholder={'타인을 비방하거나 커뮤니티 이용정책에 맞지 않는 게시글은 이유없이 삭제될 수 있습니다.'}
        />
    )
}

export default CustomReactQuill