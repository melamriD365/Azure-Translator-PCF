import { TextField } from "office-ui-fabric-react";
import React = require("react");
import { v4 as uuidv4 } from 'uuid';


interface ITranslatorControl {
    textToTranslate: string | null,
    endpoint: string,
    subscriptionKey: string,
    region: string,
    language: string, 
    NumberOfRows: number
}

interface ITranslatorState {
    translatedText: string,
    detectedLanguage: string
}

export default class TranslatorControl extends React.Component<ITranslatorControl, ITranslatorState> {

    constructor(props: ITranslatorControl) {
        super(props)
        this.state = {
            translatedText: "",
            detectedLanguage: ""
        }
    }

    translateText() {
        fetch(this.props.endpoint + 'translate?api-version=3.0&to=' + this.props.language, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': this.props.subscriptionKey,
                'Ocp-Apim-Subscription-Region': this.props.region,
                'Content-type': 'application/json',
                'X-ClientTraceId': uuidv4().toString()
            },
            body: JSON.stringify([{ 'Text': this.props.textToTranslate }]),
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    detectedLanguage: data[0].detectedLanguage.language,
                    translatedText: data[0].translations[0].text
                })
                console.log('Success:', data[0]);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    componentDidMount() {
        this.translateText();
    }

    getSnapshotBeforeUpdate(prevProps: ITranslatorControl, prevState: ITranslatorState) {
        if (prevProps.textToTranslate !== this.props.textToTranslate) {
            this.translateText();
        }
    }

    renderTranslatedText() {
        let translatedText = this.state.translatedText; 
        if(this.props.NumberOfRows === 1){
            return (
                <div>
                    <TextField value={translatedText}/>
                </div>
            )
        }
        else {
            return (
                <div>
                    <TextField multiline rows={this.props.NumberOfRows} value={translatedText}/>
                </div>
            )
        }   
    }

    render() {
        return (
            <div>
                {this.renderTranslatedText()}
            </div>

        );
    }
}