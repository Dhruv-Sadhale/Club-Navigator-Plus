from django import template

register = template.Library()

@register.filter(name='split_by_newline')
def split_by_comma(value):
    return value.split('\n')