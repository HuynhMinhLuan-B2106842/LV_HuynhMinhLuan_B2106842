from __future__ import annotations  # Thêm dòng này để hỗ trợ type annotations

from rasa.engine.graph import GraphComponent, ExecutionContext
from rasa.engine.storage.resource import Resource
from rasa.engine.storage.storage import ModelStorage
from rasa.engine.recipes.default_recipe import DefaultV1Recipe
from rasa.nlu.tokenizers.tokenizer import Token, Tokenizer
from rasa.shared.nlu.training_data.message import Message  # Import rõ ràng Message
from pyvi import ViTokenizer
from typing import Any, List, Text, Dict, Optional

@DefaultV1Recipe.register(
    [DefaultV1Recipe.ComponentType.MESSAGE_TOKENIZER],
    is_trainable=False
)
class VietnameseTokenizer(Tokenizer, GraphComponent):
    @classmethod
    def create(
        cls,
        config: Dict[Text, Any],
        model_storage: ModelStorage,
        resource: Resource,
        execution_context: ExecutionContext,
    ) -> VietnameseTokenizer:  # Loại bỏ dấu nháy quanh VietnameseTokenizer
        return cls(config)

    def __init__(self, config: Dict[Text, Any] = None) -> None:
        super().__init__(config or {})

    def tokenize(self, message: Message, attribute: Text) -> List[Token]:  # Loại bỏ dấu nháy quanh Message
        text = message.get(attribute)
        tokenized_text = ViTokenizer.tokenize(text)
        words = tokenized_text.split(" ")
        tokens = []
        offset = 0
        for word in words:
            word_length = len(word)
            tokens.append(Token(word, offset))
            offset += word_length + 1  # +1 cho khoảng trắng
        return tokens

    @classmethod
    def required_packages(cls) -> List[Text]:
        return ["pyvi"]

    def process(self, messages: List[Message]) -> List[Message]:  # Loại bỏ dấu nháy quanh Message
        for message in messages:
            tokens = self.tokenize(message, "text")
            message.set("tokens", tokens, level=1)
        return messages