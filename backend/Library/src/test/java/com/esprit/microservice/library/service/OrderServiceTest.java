package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Cart;
import com.esprit.microservice.library.entity.CartItem;
import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.OrderStatus;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService — Unit Tests")
class OrderServiceTest {

    @Mock private CartService cartService;
    @Mock private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private static final Long USER_ID = 42L;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product("Python Guide", "Desc", "Author",
                ProductType.PDF, 19.99, null, null, true);

        CartItem item = new CartItem();
        item.setProduct(product);
        item.setQuantity(2);

        cart = new Cart();
        cart.setUserId(USER_ID);
        cart.setCheckedOut(false);
        cart.setItems(new ArrayList<>(List.of(item)));
    }

    // ── checkout ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("checkout: should create PAID order from active cart")
    void checkout_success() {
        Order savedOrder = new Order();
        savedOrder.setUserId(USER_ID);
        savedOrder.setStatus(OrderStatus.PAID);
        savedOrder.setCreatedAt(LocalDateTime.now());

        when(cartService.getActiveCart(USER_ID)).thenReturn(cart);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        Order result = orderService.checkout(USER_ID);

        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PAID);
        assertThat(result.getUserId()).isEqualTo(USER_ID);
        assertThat(cart.getCheckedOut()).isTrue();
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    @DisplayName("checkout: should throw IllegalStateException when cart is empty")
    void checkout_emptyCart() {
        cart.setItems(new ArrayList<>());
        when(cartService.getActiveCart(USER_ID)).thenReturn(cart);

        assertThatThrownBy(() -> orderService.checkout(USER_ID))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("empty");

        verify(orderRepository, never()).save(any());
    }

    // ── getById ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getById: should return order when found")
    void getById_found() {
        Order order = new Order();
        order.setUserId(USER_ID);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        Order result = orderService.getById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getUserId()).isEqualTo(USER_ID);
    }

    @Test
    @DisplayName("getById: should throw RuntimeException when not found")
    void getById_notFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("not found");
    }

    // ── getByUserId ───────────────────────────────────────────────────────────

    @Test
    @DisplayName("getByUserId: should return user orders ordered by date desc")
    void getByUserId_returnsList() {
        Order o1 = new Order(); o1.setUserId(USER_ID);
        Order o2 = new Order(); o2.setUserId(USER_ID);

        when(orderRepository.findByUserIdOrderByCreatedAtDesc(USER_ID))
                .thenReturn(List.of(o1, o2));

        List<Order> result = orderService.getByUserId(USER_ID);

        assertThat(result).hasSize(2);
        verify(orderRepository).findByUserIdOrderByCreatedAtDesc(USER_ID);
    }
}
