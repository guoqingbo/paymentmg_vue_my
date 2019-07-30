export default {
  name: 'render',
  functional: true,
  props: {
    params: Object,
    render: Function,
  },
  render: (h, ctx) => {
    const params = ctx.props.params;
    return ctx.props.render(h, params);
  }
};
