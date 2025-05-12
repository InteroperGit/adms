import {JSX} from "react";

/**
 * Сообщение об ошибке "Сервис недоступен"
 * @constructor
 */
const ServiceIsNotRespondedError = (): JSX.Element => {
    return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
            <h1 className="text-xl text-red-600">Сервис временно недоступен. Попробуйте позже.</h1>
        </div>
    );
}

export default ServiceIsNotRespondedError;